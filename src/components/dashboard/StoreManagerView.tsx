import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Edit2, Tag, DollarSign, Check } from 'lucide-react';
import { StoreProduct } from '../../types';
import { generateId } from '../../utils/idGenerator';

export const StoreManagerView: React.FC = () => {
  const [products, setProducts] = useState<StoreProduct[]>([
    {
      id: 'prod_1',
      name: 'Silk Horizon Blazer',
      price: 289,
      salePrice: 249,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
      description: 'Tailored 100% pure silk blazer in ivory tone.',
      category: 'Apparel',
      inStock: true,
    },
    {
      id: 'prod_2',
      name: 'Minimalist Gold Pendant',
      price: 145,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      description: 'Handcrafted 18k solid gold minimalist pendant necklace.',
      category: 'Jewelry',
      inStock: true,
    },
    {
      id: 'prod_3',
      name: 'Structured Leather Tote',
      price: 320,
      salePrice: 280,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      description: 'Italian full-grain leather tote bag with brass hardware.',
      category: 'Accessories',
      inStock: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('99.00');
  const [category, setCategory] = useState('Apparel');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
  );
  const [description, setDescription] = useState('Premium quality item.');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: StoreProduct = {
      id: generateId('prod'),
      name,
      price: parseFloat(price) || 0,
      image,
      description,
      category,
      inStock: true,
    };

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    setName('');
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10">
        <div>
          <h1 className="text-3xl font-serif italic text-[#1A1A1A]">Store Inventory</h1>
          <p className="text-xs uppercase tracking-widest text-[#1A1A1A]/60 mt-1">
            Manage product catalog items for binding into store grids & e-commerce cards.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] rounded-full text-xs font-semibold shadow-md flex items-center gap-2 transition-all uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-2xl overflow-hidden hover:border-[#1A1A1A]/30 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="h-44 bg-[#F9F7F2] relative overflow-hidden border-b border-[#1A1A1A]/10">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#F9F7F2]/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A] rounded-full border border-[#1A1A1A]/20">
                  {p.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif italic text-[#1A1A1A] text-lg truncate">{p.name}</h3>
                <p className="text-xs text-[#1A1A1A]/70 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 mt-3 font-semibold text-[#1A1A1A]">
                  <span>${p.price.toFixed(2)}</span>
                  {p.salePrice && <span className="text-[#1A1A1A]/40 text-xs line-through">${p.salePrice.toFixed(2)}</span>}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F9F7F2] border-t border-[#1A1A1A]/10 flex justify-end">
              <button
                onClick={() => handleDelete(p.id)}
                className="p-1.5 bg-[#E5E2D9] hover:bg-rose-100 text-rose-700 rounded-full border border-[#1A1A1A]/10 transition-colors"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#F9F7F2] border border-[#1A1A1A]/20 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-2xl font-serif italic text-[#1A1A1A]">Add Store Item</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Silk Horizon Blazer"
                  className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-[#E5E2D9] text-[#1A1A1A] rounded-full text-xs font-semibold uppercase tracking-wider border border-[#1A1A1A]/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1A1A1A] text-[#F9F7F2] rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
