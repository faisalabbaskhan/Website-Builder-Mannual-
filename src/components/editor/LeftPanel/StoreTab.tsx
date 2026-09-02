import React from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import { StoreProduct, CanvasElement } from '../../../types';

interface StoreTabProps {
  products: StoreProduct[];
  selectedElement: CanvasElement | null;
  onBindProduct: (product: StoreProduct) => void;
}

export const StoreTab: React.FC<StoreTabProps> = ({ products, selectedElement, onBindProduct }) => {
  return (
    <div className="p-4 space-y-4 text-[#1A1A1A]">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80">Store Products</h3>
        <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
          {selectedElement
            ? `Click a product to bind data to [${selectedElement.name}].`
            : 'Store inventory available for e-commerce blocks.'}
        </p>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => onBindProduct(p)}
            className="p-3 bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-2xl hover:border-[#1A1A1A] cursor-pointer transition-all flex items-center gap-3"
          >
            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl shrink-0 border border-[#1A1A1A]/10" />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-serif italic text-[#1A1A1A] truncate">{p.name}</h4>
              <p className="text-[10px] text-[#1A1A1A] font-semibold">${p.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
