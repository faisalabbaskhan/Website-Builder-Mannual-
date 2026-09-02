import React from 'react';
import { Layers, ChevronUp, ChevronDown, Trash2, Box, Heading, Type, MousePointerClick, Image as ImageIcon } from 'lucide-react';
import { CanvasElement } from '../../../types';

interface LayersTabProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (el: CanvasElement) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

export const LayersTab: React.FC<LayersTabProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onMoveUp,
  onMoveDown,
  onDeleteElement,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'heading':
        return Heading;
      case 'paragraph':
      case 'text':
        return Type;
      case 'button':
        return MousePointerClick;
      case 'image':
        return ImageIcon;
      default:
        return Box;
    }
  };

  return (
    <div className="p-4 space-y-4 text-[#1A1A1A]">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80">Page Layers Tree</h3>
        <p className="text-xs text-[#1A1A1A]/60 mt-0.5">Structure and order of elements on canvas.</p>
      </div>

      {elements.length > 0 ? (
        <div className="space-y-1.5">
          {elements.map((el, index) => {
            const isSelected = el.id === selectedElementId;
            const Icon = getIcon(el.type);

            return (
              <div
                key={el.id}
                onClick={() => onSelectElement(el)}
                className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all text-xs ${
                  isSelected
                    ? 'bg-[#E5E2D9] border-[#1A1A1A] text-[#1A1A1A] font-semibold shadow-xs'
                    : 'bg-[#E5E2D9]/40 border-[#1A1A1A]/10 text-[#1A1A1A]/80 hover:border-[#1A1A1A]/30 hover:bg-[#E5E2D9]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                  <span className="truncate">{el.name || el.type}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveUp(el.id);
                    }}
                    disabled={index === 0}
                    className="p-1 text-[#1A1A1A]/40 hover:text-[#1A1A1A] disabled:opacity-20"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveDown(el.id);
                    }}
                    disabled={index === elements.length - 1}
                    className="p-1 text-[#1A1A1A]/40 hover:text-[#1A1A1A] disabled:opacity-20"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    className="p-1 text-[#1A1A1A]/40 hover:text-rose-700"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-[#1A1A1A]/50 font-serif italic text-sm">No elements on page yet.</div>
      )}
    </div>
  );
};
