/**
 * Safeguard for environments (such as sandboxed iframes or polyfills)
 * where window.fetch or Window.prototype.fetch is defined as a getter-only accessor,
 * preventing 'TypeError: Cannot set property fetch of #<Window> which has only a getter'.
 */
export function ensureFetchWritable(): void {
  try {
    if (typeof window === 'undefined') return;

    let activeFetch = window.fetch ? window.fetch.bind(window) : undefined;

    // Patch prototype if present
    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        const protoDesc = Object.getOwnPropertyDescriptor(Window.prototype, 'fetch');
        if (protoDesc && !protoDesc.set && protoDesc.configurable) {
          Object.defineProperty(Window.prototype, 'fetch', {
            get() {
              return activeFetch;
            },
            set(fn) {
              activeFetch = fn;
            },
            configurable: true,
            enumerable: true,
          });
        }
      } catch {
        // Continue to window level
      }
    }

    // Patch window directly with getter and setter
    try {
      const winDesc = Object.getOwnPropertyDescriptor(window, 'fetch');
      if (!winDesc || (!winDesc.set && winDesc.configurable)) {
        Object.defineProperty(window, 'fetch', {
          get() {
            return activeFetch;
          },
          set(fn) {
            activeFetch = fn;
          },
          configurable: true,
          enumerable: true,
        });
      }
    } catch {
      // Ignored
    }

    // Patch globalThis if different
    if (typeof globalThis !== 'undefined' && (globalThis as unknown) !== window) {
      try {
        const gtDesc = Object.getOwnPropertyDescriptor(globalThis, 'fetch');
        if (!gtDesc || (!gtDesc.set && gtDesc.configurable)) {
          Object.defineProperty(globalThis, 'fetch', {
            get() {
              return activeFetch;
            },
            set(fn) {
              activeFetch = fn;
            },
            configurable: true,
            enumerable: true,
          });
        }
      } catch {
        // Ignored
      }
    }
  } catch {
    // Non-fatal fallback
  }
}

// Execute immediately upon module load
ensureFetchWritable();
