import React from 'react';
import { DeviceMode, CanvasElement, Project, WebPage } from '../../../types';
import { ElementRenderer } from '../ElementRenderer';
import { Sparkles, Plus, ChevronUp, ChevronDown, Copy, Trash2 } from 'lucide-react';

interface CanvasAreaProps {
  project: Project;
  activePage: WebPage;
  deviceMode: DeviceMode;
  selectedElement: CanvasElement | null;
  onSelectElement: (el: CanvasElement | null) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  project,
  activePage,
  deviceMode,
  selectedElement,
  onSelectElement,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}) => {
  const getViewportWidthClass = () => {
    switch (deviceMode) {
      case 'tablet':
        return 'w-[768px] shadow-xl rounded-3xl border border-[#1A1A1A]/20 my-8';
      case 'mobile':
        return 'w-[375px] shadow-xl rounded-3xl border border-[#1A1A1A]/20 my-8';
      default:
        return 'w-full min-h-full';
    }
  };

  return (
    <main
      className="flex-1 bg-[#E5E2D9] overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start h-[calc(100vh-4rem)] relative"
      onClick={() => onSelectElement(null)}
    >
      <div
        className={`bg-[#F9F7F2] transition-all duration-300 relative ${getViewportWidthClass()}`}
        style={{ fontFamily: project.settings.fontFamily }}
      >
        {activePage.elements && activePage.elements.length > 0 ? (
          <div className="space-y-0 relative min-h-[600px] pb-16">
            {activePage.elements.map((el) => {
              const isSelected = selectedElement?.id === el.id;

              return (
                <div key={el.id} className="relative group">
                  {/* Selected Element floating quick control toolbar */}
                  {isSelected && (
                    <div className="absolute -top-10 right-4 z-40 bg-[#1A1A1A] text-[#F9F7F2] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-sans">
                      <span className="font-bold text-[#F9F7F2] text-[9px] uppercase tracking-wider pr-1.5 border-r border-[#F9F7F2]/20">
                        {el.type}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveUp(el.id);
                        }}
                        className="p-1 hover:text-[#E5E2D9] transition-colors"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveDown(el.id);
                        }}
                        className="p-1 hover:text-[#E5E2D9] transition-colors"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicate(el.id);
                        }}
                        className="p-1 hover:text-[#E5E2D9] transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(el.id);
                        }}
                        className="p-1 hover:text-rose-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <ElementRenderer
                    element={el}
                    project={project}
                    selectedElementId={selectedElement?.id}
                    onSelectElement={onSelectElement}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Page Canvas */
          <div className="p-16 text-center space-y-4 my-12">
            <div className="w-16 h-16 rounded-full bg-[#E5E2D9] text-[#1A1A1A] flex items-center justify-center mx-auto border border-[#1A1A1A]/10">
              <Sparkles className="w-8 h-8 text-[#1A1A1A]" />
            </div>
            <h3 className="text-2xl font-serif italic text-[#1A1A1A]">Empty Page Canvas</h3>
            <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto">
              This page ({activePage.name}) does not have any elements yet. Select blocks from the left sidebar to add them.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};
