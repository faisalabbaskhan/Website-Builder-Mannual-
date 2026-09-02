import JSZip from 'jszip';
import { Project, WebPage, CanvasElement, StoreProduct } from '../types';

export async function exportProjectToZip(project: Project): Promise<Blob> {
  const zip = new JSZip();

  // 1. Generate Stylesheet
  const cssContent = generateStylesheet(project);
  zip.file('css/style.css', cssContent);

  // 2. Generate Interactive JS
  const jsContent = generateMainJS(project);
  zip.file('js/main.js', jsContent);

  // 3. Generate HTML pages
  project.pages.forEach((page) => {
    const filename = page.isHomePage || page.slug === 'home' ? 'index.html' : `${page.slug}.html`;
    const htmlContent = generateHTMLPage(project, page);
    zip.file(filename, htmlContent);
  });

  // 4. Generate README for exported code
  const readme = `# ${project.name} - Generated Website

Exported with **WebForge Studio** on ${new Date().toLocaleDateString()}

## File Structure
- \`index.html\` - Home Page
${project.pages
  .filter((p) => !p.isHomePage && p.slug !== 'home')
  .map((p) => `- \`${p.slug}.html\` - ${p.name}`)
  .join('\n')}
- \`css/style.css\` - Custom responsive styles
- \`js/main.js\` - Interactive scripts (sliders, mobile navbar, shopping cart, forms)

## How to Deploy / Host
1. Upload all files and folders to any Web Host (Vercel, Netlify, GitHub Pages, Apache, Nginx, Shared Hosting).
2. Open \`index.html\` directly in any modern web browser to view locally.
`;
  zip.file('README.md', readme);

  // Compress and generate blob
  return await zip.generateAsync({ type: 'blob' });
}

function generateHTMLPage(project: Project, page: WebPage): string {
  const { settings, pages } = project;
  
  const navLinksHTML = pages
    .map((p) => {
      const target = p.isHomePage || p.slug === 'home' ? 'index.html' : `${p.slug}.html`;
      const isActive = p.id === page.id ? 'active' : '';
      return `<a href="${target}" class="nav-link ${isActive}">${p.name}</a>`;
    })
    .join('\n        ');

  const pageBodyElements = page.elements
    .map((el) => renderElementToHTML(el, project))
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title || project.name}</title>
  <meta name="description" content="${project.description || ''}">
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Header / Navigation -->
  <header class="site-header">
    <div class="header-container">
      <a href="index.html" class="site-logo">${project.name}</a>
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle Navigation">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-menu" id="navMenu">
        ${navLinksHTML}
        ${
          project.products.length > 0
            ? `<button class="cart-trigger-btn" id="cartOpenBtn">🛒 Cart (<span id="cartCount">0</span>)</button>`
            : ''
        }
      </nav>
    </div>
  </header>

  <!-- Page Content -->
  <main class="main-content">
    ${pageBodyElements}
  </main>

  <!-- Shopping Cart Drawer (E-Commerce) -->
  ${
    project.products.length > 0
      ? `
  <div class="cart-drawer-overlay" id="cartOverlay">
    <div class="cart-drawer">
      <div class="cart-header">
        <h3>Your Shopping Cart</h3>
        <button class="close-cart-btn" id="cartCloseBtn">&times;</button>
      </div>
      <div class="cart-items" id="cartItemsContainer">
        <p class="empty-cart-msg">Your cart is currently empty.</p>
      </div>
      <div class="cart-footer">
        <div class="cart-subtotal">
          <span>Subtotal:</span>
          <span id="cartSubtotal">$0.00</span>
        </div>
        <button class="checkout-btn" onclick="alert('Demo Store: Order placed successfully!')">Proceed to Checkout</button>
      </div>
    </div>
  </div>
  `
      : ''
  }

  <script src="js/main.js"></script>
</body>
</html>`;
}

function renderElementToHTML(el: CanvasElement, project: Project): string {
  const stylesAttr = buildInlineStyles(el.styles);

  switch (el.type) {
    case 'heading': {
      const Tag = el.headingTag || 'h2';
      return `<${Tag} style="${stylesAttr}">${escapeHtml(el.content || 'Heading Text')}</${Tag}>`;
    }

    case 'paragraph':
    case 'text':
      return `<p style="${stylesAttr}">${escapeHtml(el.content || 'Paragraph content text goes here...')}</p>`;

    case 'button': {
      const link = getLinkTarget(el, project);
      return `<a href="${link}" class="btn btn-${el.buttonVariant || 'solid'}" style="${stylesAttr}">${escapeHtml(
        el.content || 'Click Here'
      )}</a>`;
    }

    case 'image':
      return `<img src="${el.src || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800'}" alt="${
        el.alt || 'Image'
      }" style="${stylesAttr}" loading="lazy" />`;

    case 'video':
      return `
      <div class="video-wrapper" style="${stylesAttr}">
        <video src="${el.src || ''}" ${el.controls ? 'controls' : ''} ${el.autoplay ? 'autoplay' : ''} ${
        el.loop ? 'loop' : ''
      } ${el.muted ? 'muted' : ''} poster="${el.poster || ''}"></video>
      </div>`;

    case 'hero':
      return `
      <section class="hero-section" style="${stylesAttr}">
        <div class="container">
          <h1 class="hero-title">${escapeHtml(el.content || 'Build Amazing Digital Experiences')}</h1>
          <p class="hero-subtitle">High performance, visually responsive, and engineered for high conversions.</p>
          <div class="hero-actions">
            <a href="${project.pages[0] ? 'index.html' : '#'}" class="btn btn-solid">Get Started Now</a>
            <a href="${project.pages[1] ? `${project.pages[1].slug}.html` : '#'}" class="btn btn-outline">Learn More</a>
          </div>
        </div>
      </section>`;

    case 'feature-grid':
      return `
      <section class="feature-grid-section" style="${stylesAttr}">
        <div class="container">
          <h2 class="section-heading">Key Platform Features</h2>
          <div class="grid-3">
            <div class="feature-card">
              <div class="icon-box">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Optimized bundle size ensuring instant page loads across desktop and mobile.</p>
            </div>
            <div class="feature-card">
              <div class="icon-box">🎨</div>
              <h3>Visual Control</h3>
              <p>Full design control over typography, layouts, colors, and responsive previews.</p>
            </div>
            <div class="feature-card">
              <div class="icon-box">🔒</div>
              <h3>Secure & Reliable</h3>
              <p>Built with enterprise security standards and standard clean web practices.</p>
            </div>
          </div>
        </div>
      </section>`;

    case 'product-grid': {
      const prodsHTML = project.products
        .map(
          (p) => `
        <div class="product-card">
          <div class="product-img-box">
            <img src="${p.image}" alt="${p.name}">
            ${p.salePrice ? '<span class="sale-badge">SALE</span>' : ''}
          </div>
          <div class="product-details">
            <span class="product-cat">${p.category}</span>
            <h4 class="product-title">${p.name}</h4>
            <div class="price-row">
              <span class="price">$${p.price.toFixed(2)}</span>
              ${p.salePrice ? `<span class="sale-price">$${p.salePrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="add-cart-btn" onclick="addToCart('${p.id}', '${escapeHtml(p.name)}', ${
            p.salePrice || p.price
          }, '${p.image}')">Add to Cart</button>
          </div>
        </div>
      `
        )
        .join('');

      return `
      <section class="products-section" style="${stylesAttr}">
        <div class="container">
          <div class="products-grid">${prodsHTML}</div>
        </div>
      </section>`;
    }

    case 'slider': {
      const slides = el.slides || [
        { id: 's1', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200', title: 'Featured Slide' },
      ];

      const slidesHTML = slides
        .map(
          (s, idx) => `
        <div class="slide ${idx === 0 ? 'active' : ''}">
          <img src="${s.image}" alt="${s.title || 'Slide'}">
          <div class="slide-caption">
            <h3>${escapeHtml(s.title || '')}</h3>
            <p>${escapeHtml(s.caption || '')}</p>
          </div>
        </div>`
        )
        .join('');

      return `
      <div class="carousel-container" style="${stylesAttr}">
        <div class="carousel-slides" id="carouselSlides">${slidesHTML}</div>
        <button class="carousel-prev" id="carouselPrev">&lsaquo;</button>
        <button class="carousel-next" id="carouselNext">&rsaquo;</button>
      </div>`;
    }

    case 'contact-form':
      return `
      <section class="contact-section" style="${stylesAttr}">
        <div class="container max-w-2xl">
          <h2>Get in Touch</h2>
          <form class="site-contact-form" onsubmit="event.preventDefault(); alert('Thank you! Your message has been sent.');">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" required placeholder="John Doe" class="form-input">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" required placeholder="john@example.com" class="form-input">
            </div>
            <div class="form-group">
              <label>Your Message</label>
              <textarea rows="4" required placeholder="How can we help you?" class="form-input"></textarea>
            </div>
            <button type="submit" class="btn btn-solid">Send Message</button>
          </form>
        </div>
      </section>`;

    case 'footer':
      return `
      <footer class="site-footer" style="${stylesAttr}">
        <div class="container text-center">
          <p>&copy; ${new Date().getFullYear()} ${project.name}. All rights reserved.</p>
        </div>
      </footer>`;

    case 'container': {
      const childrenHTML = (el.children || []).map((c) => renderElementToHTML(c, project)).join('');
      return `<div class="container-box" style="${stylesAttr}">${childrenHTML}</div>`;
    }

    default:
      return `<div style="${stylesAttr}">${escapeHtml(el.content || '')}</div>`;
  }
}

function getLinkTarget(el: CanvasElement, project: Project): string {
  if (el.targetPageId) {
    const page = project.pages.find((p) => p.id === el.targetPageId);
    if (page) return page.isHomePage || page.slug === 'home' ? 'index.html' : `${page.slug}.html`;
  }
  return el.linkUrl || '#';
}

function buildInlineStyles(s: Record<string, any>): string {
  if (!s) return '';
  const map: Record<string, string> = {
    color: 'color',
    backgroundColor: 'background-color',
    paddingTop: 'padding-top',
    paddingBottom: 'padding-bottom',
    paddingLeft: 'padding-left',
    paddingRight: 'padding-right',
    marginTop: 'margin-top',
    marginBottom: 'margin-bottom',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    fontFamily: 'font-family',
    textAlign: 'text-align',
    borderRadius: 'border-radius',
    borderColor: 'border-color',
    borderWidth: 'border-width',
    height: 'height',
    minHeight: 'min-height',
  };

  return Object.entries(s)
    .filter(([key, val]) => val !== undefined && val !== '' && map[key])
    .map(([key, val]) => `${map[key]}: ${val};`)
    .join(' ');
}

function generateStylesheet(project: Project): string {
  const settings = project.settings;
  return `/* Reset & Variables */
:root {
  --primary-color: ${settings.primaryColor || '#3b82f6'};
  --accent-color: ${settings.accentColor || '#10b981'};
  --bg-color: ${settings.backgroundColor || '#ffffff'};
  --text-color: ${settings.textColor || '#0f172a'};
  --font-family: ${settings.fontFamily || "'Inter', sans-serif"};
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

img, video {
  max-width: 100%;
  height: auto;
  display: block;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.max-w-2xl {
  max-width: 672px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

/* Header & Nav */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
}

.site-logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  transition: color 0.2s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
}

.mobile-menu-btn span {
  width: 24px;
  height: 2px;
  background-color: #1e293b;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-align: center;
}

.btn-solid {
  background-color: var(--primary-color);
  color: #ffffff;
}

.btn-solid:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-outline {
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: #ffffff;
}

/* Hero */
.hero-section {
  text-align: center;
  padding: 80px 20px;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto 32px auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* Feature Grid */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.feature-card {
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
}

.icon-box {
  font-size: 2rem;
  margin-bottom: 16px;
}

/* E-Commerce Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.product-img-box {
  position: relative;
  height: 240px;
}

.product-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sale-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #ef4444;
  color: #ffffff;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 4px;
}

.product-details {
  padding: 16px;
}

.product-cat {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
}

.product-title {
  font-size: 1.1rem;
  margin: 4px 0 8px 0;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.price {
  font-weight: 700;
  font-size: 1.1rem;
}

.sale-price {
  text-decoration: line-through;
  color: #94a3b8;
}

.add-cart-btn {
  width: 100%;
  padding: 10px;
  background-color: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.add-cart-btn:hover {
  background-color: #1e293b;
}

/* Cart Drawer */
.cart-trigger-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
}

.cart-drawer-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.cart-drawer-overlay.active {
  display: block;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.cart-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-cart-btn {
  font-size: 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
}

.cart-items {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.cart-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

.cart-subtotal {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

/* Forms */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
}

/* Carousel */
.carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.carousel-slides {
  display: flex;
  transition: transform 0.4s ease-in-out;
}

.slide {
  min-width: 100%;
  position: relative;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
}

.carousel-prev, .carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 2rem;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 50%;
}

.carousel-prev { left: 16px; }
.carousel-next { right: 16px; }

/* Responsive Media Queries */
@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .mobile-menu-btn { display: flex; }
  .nav-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #ffffff;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  .nav-menu.open { display: flex; }
}
`;
}

function generateMainJS(project: Project): string {
  return `// WebForge Studio Interactive Scripts
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // 2. Shopping Cart Overlay
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartOpenBtn && cartOverlay) {
    cartOpenBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
  }
  if (cartCloseBtn && cartOverlay) {
    cartCloseBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
  }

  // 3. Carousel Slider
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.style.display = idx === index ? 'block' : 'none';
    });
  }

  if (slides.length > 0) {
    showSlide(currentSlide);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    }
  }
});

// Cart Logic
function addToCart(id, name, price, image) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  updateCartUI();
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) cartOverlay.classList.add('active');
}

function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotal = document.getElementById('cartSubtotal');

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartCount) cartCount.textContent = totalQty;
  if (cartSubtotal) cartSubtotal.textContent = '$' + subtotal.toFixed(2);

  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
    } else {
      cartItemsContainer.innerHTML = cart.map(item => \`
        <div class="cart-item">
          <img src="\${item.image}" alt="\${item.name}">
          <div style="flex: 1;">
            <div style="font-weight: 600;">\${item.name}</div>
            <div style="font-size: 0.9rem; color: #64748b;">\$\${item.price} x \${item.quantity}</div>
          </div>
        </div>
      \`).join('');
    }
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
`;
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
