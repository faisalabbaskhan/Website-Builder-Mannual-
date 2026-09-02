import React from 'react';
import { CanvasElement, Project } from '../../types';

interface ElementRendererProps {
  element: CanvasElement;
  project: Project;
  selectedElementId?: string | null;
  onSelectElement?: (el: CanvasElement) => void;
  onPageNavigate?: (pageId: string) => void;
  isInteractive?: boolean; // True during live preview
  onAddToCart?: (product: any) => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  project,
  selectedElementId,
  onSelectElement,
  onPageNavigate,
  isInteractive = false,
  onAddToCart,
}) => {
  const isSelected = selectedElementId === element.id;

  const handleClick = (e: React.MouseEvent) => {
    if (!isInteractive) {
      e.stopPropagation();
      if (onSelectElement) onSelectElement(element);
    }
  };

  const inlineStyles: React.CSSProperties = {
    color: element.styles.color,
    backgroundColor: element.styles.backgroundColor,
    backgroundImage: element.styles.backgroundImage ? `url(${element.styles.backgroundImage})` : undefined,
    backgroundSize: element.styles.backgroundSize || 'cover',
    fontSize: element.styles.fontSize,
    fontWeight: element.styles.fontWeight,
    fontFamily: element.styles.fontFamily || project.settings.fontFamily,
    textAlign: element.styles.textAlign,
    lineHeight: element.styles.lineHeight,
    letterSpacing: element.styles.letterSpacing,
    textTransform: element.styles.textTransform,
    paddingTop: element.styles.paddingTop,
    paddingBottom: element.styles.paddingBottom,
    paddingLeft: element.styles.paddingLeft,
    paddingRight: element.styles.paddingRight,
    marginTop: element.styles.marginTop,
    marginBottom: element.styles.marginBottom,
    marginLeft: element.styles.marginLeft,
    marginRight: element.styles.marginRight,
    width: element.styles.width,
    maxWidth: element.styles.maxWidth,
    height: element.styles.height,
    minHeight: element.styles.minHeight,
    borderRadius: element.styles.borderRadius,
    borderColor: element.styles.borderColor,
    borderWidth: element.styles.borderWidth,
    borderStyle: element.styles.borderStyle as any,
    boxShadow: element.styles.boxShadow,
    opacity: element.styles.opacity,
    display: element.styles.flexDirection ? 'flex' : undefined,
    flexDirection: element.styles.flexDirection,
    justifyContent: element.styles.justifyContent,
    alignItems: element.styles.alignItems,
    gap: element.styles.gap,
  };

  const wrapClasses = `relative transition-all ${
    !isInteractive
      ? `hover:outline hover:outline-2 hover:outline-indigo-400/80 cursor-pointer ${
          isSelected ? 'outline outline-2 outline-indigo-500 ring-4 ring-indigo-500/20' : ''
        }`
      : ''
  }`;

  switch (element.type) {
    case 'heading': {
      const Tag = element.headingTag || 'h2';
      return (
        <Tag className={wrapClasses} style={inlineStyles} onClick={handleClick}>
          {element.content || 'Heading Text'}
        </Tag>
      );
    }

    case 'paragraph':
    case 'text':
      return (
        <p className={wrapClasses} style={inlineStyles} onClick={handleClick}>
          {element.content || 'Paragraph content goes here...'}
        </p>
      );

    case 'button': {
      const handleBtnClick = (e: React.MouseEvent) => {
        handleClick(e);
        if (isInteractive && element.targetPageId && onPageNavigate) {
          onPageNavigate(element.targetPageId);
        } else if (isInteractive && element.linkUrl) {
          window.open(element.linkUrl, '_blank');
        }
      };

      const btnVariantClasses =
        element.buttonVariant === 'outline'
          ? 'border-2 border-indigo-600 text-indigo-600 bg-transparent hover:bg-indigo-600 hover:text-white'
          : element.buttonVariant === 'ghost'
          ? 'bg-transparent text-indigo-600 hover:bg-indigo-50'
          : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md';

      return (
        <button
          className={`${wrapClasses} px-6 py-3 rounded-xl font-semibold transition-all inline-block ${btnVariantClasses}`}
          style={inlineStyles}
          onClick={handleBtnClick}
        >
          {element.content || 'Click Action'}
        </button>
      );
    }

    case 'image':
      return (
        <div className={wrapClasses} style={inlineStyles} onClick={handleClick}>
          <img
            src={element.src || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800'}
            alt={element.alt || 'Image'}
            className="w-full h-full object-cover rounded-[inherit]"
            style={{ objectFit: element.styles.objectFit || 'cover' }}
          />
        </div>
      );

    case 'video':
      return (
        <div className={wrapClasses} style={inlineStyles} onClick={handleClick}>
          <video
            src={element.src || ''}
            poster={element.poster || ''}
            controls={element.controls !== false}
            autoPlay={element.autoplay}
            loop={element.loop}
            muted={element.muted}
            className="w-full h-full object-cover rounded-[inherit]"
          />
        </div>
      );

    case 'navbar':
      return (
        <nav
          className={`${wrapClasses} flex items-center justify-between border-b border-slate-200/60`}
          style={{ backgroundColor: '#ffffff', padding: '16px 24px', ...inlineStyles }}
          onClick={handleClick}
        >
          <div className="font-bold text-lg text-slate-900">{project.name}</div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            {project.pages.map((p) => (
              <button
                key={p.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isInteractive && onPageNavigate) onPageNavigate(p.id);
                }}
                className="hover:text-indigo-600 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </nav>
      );

    case 'hero':
      return (
        <section
          className={`${wrapClasses} text-center py-20 px-6`}
          style={{ backgroundColor: '#f8fafc', ...inlineStyles }}
          onClick={handleClick}
        >
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              {element.content || 'Build High Performance Digital Products'}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Empower your business with responsive designs, rich interactive layouts, and modern user experiences.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={(e) => {
                  if (isInteractive && project.pages[1] && onPageNavigate) {
                    onPageNavigate(project.pages[1].id);
                  }
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-500 transition-all"
              >
                Explore More
              </button>
            </div>
          </div>
        </section>
      );

    case 'product-grid':
      return (
        <section className={`${wrapClasses} py-12 px-6`} style={inlineStyles} onClick={handleClick}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.products.map((p) => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      {p.salePrice && (
                        <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          SALE
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{p.category}</span>
                      <h4 className="font-bold text-slate-900 text-base">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-2 mt-3 font-bold text-slate-900">
                        <span>${p.price.toFixed(2)}</span>
                        {p.salePrice && <span className="text-slate-400 text-xs line-through">${p.salePrice.toFixed(2)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInteractive && onAddToCart) onAddToCart(p);
                      }}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'feature-grid':
      return (
        <section className={`${wrapClasses} py-12 px-6`} style={inlineStyles} onClick={handleClick}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Platform Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">⚡</div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Blazing Fast Speed</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Engineered for lightning fast loads and instant responsiveness.</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg mb-4">🎨</div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Visual Precision</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Drag and drop editing with pixel-perfect control over every element.</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">📦</div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Export Anywhere</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Download full HTML/CSS/JS code zip archives with zero platform lock-in.</p>
              </div>
            </div>
          </div>
        </section>
      );

    case 'contact-form':
      return (
        <section className={`${wrapClasses} py-12 px-6`} style={inlineStyles} onClick={handleClick}>
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
            <p className="text-xs text-slate-500 mb-6">Our team usually responds within 24 hours.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isInteractive) alert('Thank you! Your message has been sent successfully.');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input type="text" required placeholder="John Doe" className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" required placeholder="john@example.com" className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea rows={4} required placeholder="Write your inquiry here..." className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900" />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm shadow hover:bg-indigo-500 transition-colors">
                Submit Inquiry
              </button>
            </form>
          </div>
        </section>
      );

    case 'footer':
      return (
        <footer className={`${wrapClasses} py-8 px-6 text-center border-t border-slate-800 bg-slate-950 text-slate-400 text-xs`} style={inlineStyles} onClick={handleClick}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>&copy; {new Date().getFullYear()} {project.name}. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-slate-200">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-200">Terms of Service</a>
            </div>
          </div>
        </footer>
      );

    case 'container': {
      return (
        <div className={`${wrapClasses} space-y-4`} style={inlineStyles} onClick={handleClick}>
          {element.children && element.children.length > 0 ? (
            element.children.map((child) => (
              <ElementRenderer
                key={child.id}
                element={child}
                project={project}
                selectedElementId={selectedElementId}
                onSelectElement={onSelectElement}
                onPageNavigate={onPageNavigate}
                isInteractive={isInteractive}
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
              Empty Container Box — Drag or click elements to populate.
            </div>
          )}
        </div>
      );
    }

    default:
      return (
        <div className={wrapClasses} style={inlineStyles} onClick={handleClick}>
          {element.content || 'Content block'}
        </div>
      );
  }
};
