import React, { useState } from 'react';
import { X, ShoppingBag, ArrowLeft, ExternalLink, Check, Trash2 } from 'lucide-react';
import { Project, StoreProduct, CartItem } from '../../types';
import { ElementRenderer } from '../editor/ElementRenderer';

interface LivePreviewModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ project, isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activePageId, setActivePageId] = useState<string>(
    project.pages.find((p) => p.isHomePage)?.id || project.pages[0]?.id || ''
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const activePage = project.pages.find((p) => p.id === activePageId) || project.pages[0];

  const handleAddToCart = (product: StoreProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowCartDrawer(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );
  const cartTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/80 backdrop-blur-md z-50 flex flex-col font-sans">
      {/* Top Floating Bar */}
      <div className="h-16 bg-[#1A1A1A] border-b border-[#F9F7F2]/10 px-6 flex items-center justify-between text-[#F9F7F2]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F9F7F2]/10 hover:bg-[#F9F7F2]/20 text-[#F9F7F2] rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Preview
          </button>
          <div className="h-4 w-px bg-[#F9F7F2]/20" />
          <span className="text-xs text-[#F9F7F2]/70">
            Previewing: <strong className="text-[#F9F7F2] font-serif italic">{project.name}</strong> ({activePage?.name})
          </span>
        </div>

        {/* Page Selector & Cart Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F9F7F2]/10 p-1 rounded-full border border-[#F9F7F2]/10">
            {project.pages.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePageId(p.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  p.id === activePageId
                    ? 'bg-[#F9F7F2] text-[#1A1A1A]'
                    : 'text-[#F9F7F2]/70 hover:text-[#F9F7F2]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {project.products.length > 0 && (
            <button
              onClick={() => setShowCartDrawer(true)}
              className="px-4 py-2 bg-[#F9F7F2]/10 hover:bg-[#F9F7F2]/20 border border-[#F9F7F2]/10 text-[#F9F7F2] rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 relative"
            >
              <ShoppingBag className="w-4 h-4 text-[#F9F7F2]" />
              <span>Cart ({cartTotalQty})</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F9F7F2]/10 rounded-full text-[#F9F7F2]/70 hover:text-[#F9F7F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Website Live Preview Canvas Frame */}
      <div className="flex-1 overflow-y-auto bg-[#F9F7F2]" style={{ fontFamily: project.settings.fontFamily }}>
        {activePage?.elements.map((el) => (
          <ElementRenderer
            key={el.id}
            element={el}
            project={project}
            isInteractive={true}
            onPageNavigate={(pageId) => setActivePageId(pageId)}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Shopping Cart Drawer */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#F9F7F2] text-[#1A1A1A] h-full p-6 flex flex-col justify-between shadow-2xl border-l border-[#1A1A1A]/10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10">
                <h3 className="text-xl font-serif italic text-[#1A1A1A]">Your Shopping Cart</h3>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1.5 hover:bg-[#E5E2D9] rounded-full text-[#1A1A1A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 border border-[#1A1A1A]/10 rounded-2xl bg-[#E5E2D9]"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-xl border border-[#1A1A1A]/10"
                        />
                        <div>
                          <h4 className="font-serif italic text-sm text-[#1A1A1A]">{item.product.name}</h4>
                          <span className="text-xs text-[#1A1A1A]/60 font-mono">
                            ${(item.product.salePrice || item.product.price).toFixed(2)} x {item.quantity}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#1A1A1A]/50 font-serif italic text-center py-8">Your cart is currently empty.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="uppercase text-xs tracking-wider text-[#1A1A1A]/70">Subtotal:</span>
                <span className="text-[#1A1A1A] text-lg font-serif italic">${cartSubtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => {
                  alert('Demo Store Order Placed Successfully!');
                  setCart([]);
                  setShowCartDrawer(false);
                }}
                disabled={cart.length === 0}
                className="w-full py-3 bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-50 text-[#F9F7F2] rounded-full font-bold text-xs uppercase tracking-widest shadow-md transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
