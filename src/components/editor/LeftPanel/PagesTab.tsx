import React, { useState } from 'react';
import { FileText, Plus, Trash2, Home, Copy, Check } from 'lucide-react';
import { WebPage } from '../../../types';
import { generateId } from '../../../utils/idGenerator';

interface PagesTabProps {
  pages: WebPage[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: (page: WebPage) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
  onSetHomePage: (id: string) => void;
}

export const PagesTab: React.FC<PagesTabProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
  onSetHomePage,
}) => {
  const [newPageName, setNewPageName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;

    const slug = newPageName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newPage: WebPage = {
      id: generateId('page'),
      name: newPageName.trim(),
      slug,
      title: `${newPageName.trim()} Page`,
      isHomePage: false,
      elements: [],
    };

    onAddPage(newPage);
    setNewPageName('');
    setShowAddForm(false);
  };

  return (
    <div className="p-4 space-y-4 text-[#1A1A1A]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80">Website Pages</h3>
          <p className="text-xs text-[#1A1A1A]/60 mt-0.5">Manage routes and create new pages.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] rounded-full text-xs font-semibold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreatePage} className="p-3 bg-[#E5E2D9] border border-[#1A1A1A]/20 rounded-2xl space-y-2">
          <input
            type="text"
            required
            autoFocus
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name (e.g. Services)"
            className="w-full bg-[#F9F7F2] border border-[#1A1A1A]/15 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-1 bg-[#F9F7F2] text-[#1A1A1A] rounded-full text-[10px] uppercase tracking-wider border border-[#1A1A1A]/10"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 py-1 bg-[#1A1A1A] text-[#F9F7F2] rounded-full text-[10px] font-semibold uppercase tracking-wider">
              Add Page
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {pages.map((p) => {
          const isActive = p.id === activePageId;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPage(p.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#E5E2D9] border-[#1A1A1A] text-[#1A1A1A] shadow-xs'
                  : 'bg-[#E5E2D9]/40 border-[#1A1A1A]/10 text-[#1A1A1A]/80 hover:border-[#1A1A1A]/30 hover:bg-[#E5E2D9]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'}`} />
                <div className="truncate">
                  <p className="text-xs font-serif italic text-[#1A1A1A]">{p.name}</p>
                  <p className="text-[10px] text-[#1A1A1A]/60 font-mono truncate">/{p.slug}.html</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {p.isHomePage ? (
                  <span className="p-1 text-[#1A1A1A]" title="Home Page">
                    <Home className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetHomePage(p.id);
                    }}
                    className="p-1 text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                    title="Set as Home Page"
                  >
                    <Home className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicatePage(p.id);
                  }}
                  className="p-1 text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                  title="Duplicate Page"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {!p.isHomePage && pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(p.id);
                    }}
                    className="p-1 text-[#1A1A1A]/40 hover:text-rose-700"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
