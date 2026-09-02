import React from 'react';
import {
  Sliders,
  Type,
  Palette,
  Layout,
  MousePointerClick,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Box,
} from 'lucide-react';
import { CanvasElement, Project, ElementStyles } from '../../../types';

interface RightPanelProps {
  selectedElement: CanvasElement | null;
  project: Project;
  onUpdateElement: (updated: CanvasElement) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  selectedElement,
  project,
  onUpdateElement,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}) => {
  if (!selectedElement) {
    return (
      <aside className="w-80 bg-[#F9F7F2] border-l border-[#1A1A1A]/10 p-6 flex flex-col items-center justify-center text-center text-[#1A1A1A]/50 shrink-0 h-[calc(100vh-4rem)] font-serif italic">
        <Sliders className="w-10 h-10 text-[#1A1A1A]/30 mb-3" />
        <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80">Inspector Properties</h4>
        <p className="text-xs text-[#1A1A1A]/60 mt-1 max-w-[200px] font-sans not-italic">
          Select any element on the visual canvas to inspect and edit its style & content.
        </p>
      </aside>
    );
  }

  const updateStyles = (styleKey: keyof ElementStyles, value: any) => {
    onUpdateElement({
      ...selectedElement,
      styles: {
        ...selectedElement.styles,
        [styleKey]: value,
      },
    });
  };

  return (
    <aside className="w-80 bg-[#F9F7F2] border-l border-[#1A1A1A]/10 p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] overflow-y-auto text-[#1A1A1A]">
      <div className="space-y-6">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/70">Element Properties</span>
            <h3 className="text-base font-serif italic text-[#1A1A1A]">{selectedElement.name || selectedElement.type}</h3>
          </div>
          <span className="text-[9px] font-mono text-[#1A1A1A] bg-[#E5E2D9] px-2.5 py-1 rounded-full border border-[#1A1A1A]/10 uppercase">
            {selectedElement.type}
          </span>
        </div>

        {/* Content Section (Text, Heading, Button, Link) */}
        {(selectedElement.type === 'heading' ||
          selectedElement.type === 'paragraph' ||
          selectedElement.type === 'text' ||
          selectedElement.type === 'button' ||
          selectedElement.type === 'hero') && (
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#1A1A1A]" /> Text Content
            </label>
            <textarea
              rows={3}
              value={selectedElement.content || ''}
              onChange={(e) => onUpdateElement({ ...selectedElement, content: e.target.value })}
              className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />

            {selectedElement.type === 'heading' && (
              <div>
                <label className="block text-[10px] font-semibold text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Heading Tag</label>
                <select
                  value={selectedElement.headingTag || 'h2'}
                  onChange={(e) => onUpdateElement({ ...selectedElement, headingTag: e.target.value as any })}
                  className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A]"
                >
                  <option value="h1">H1 (Main Headline)</option>
                  <option value="h2">H2 (Section Header)</option>
                  <option value="h3">H3 (Subheader)</option>
                  <option value="h4">H4 (Card Title)</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Button Link Target */}
        {selectedElement.type === 'button' && (
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-[#1A1A1A]" /> Link Target
            </label>

            <div>
              <label className="block text-[10px] text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Target Internal Page</label>
              <select
                value={selectedElement.targetPageId || ''}
                onChange={(e) => onUpdateElement({ ...selectedElement, targetPageId: e.target.value })}
                className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A]"
              >
                <option value="">None (External / Custom URL)</option>
                {project.pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    📄 {p.name} ({p.slug}.html)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Custom Link URL</label>
              <input
                type="text"
                value={selectedElement.linkUrl || ''}
                onChange={(e) => onUpdateElement({ ...selectedElement, linkUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A]"
              />
            </div>
          </div>
        )}

        {/* Media Src Settings (Image & Video) */}
        {(selectedElement.type === 'image' || selectedElement.type === 'video') && (
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#1A1A1A]" /> Media Settings
            </label>
            <div>
              <label className="block text-[10px] text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Media Source URL</label>
              <input
                type="text"
                value={selectedElement.src || ''}
                onChange={(e) => onUpdateElement({ ...selectedElement, src: e.target.value })}
                className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A]"
              />
            </div>
          </div>
        )}

        {/* Styling: Typography & Alignments */}
        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#1A1A1A]" /> Color & Styling
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Text Color</label>
              <input
                type="color"
                value={selectedElement.styles.color || '#1A1A1A'}
                onChange={(e) => updateStyles('color', e.target.value)}
                className="w-full h-8 rounded-xl bg-[#E5E2D9] border border-[#1A1A1A]/15 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Background Color</label>
              <input
                type="color"
                value={selectedElement.styles.backgroundColor || '#F9F7F2'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                className="w-full h-8 rounded-xl bg-[#E5E2D9] border border-[#1A1A1A]/15 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Text Alignment</label>
            <div className="grid grid-cols-3 gap-1 bg-[#E5E2D9] p-1 rounded-full border border-[#1A1A1A]/10">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateStyles('textAlign', align)}
                  className={`py-1 text-[10px] font-semibold capitalize rounded-full transition-all ${
                    selectedElement.styles.textAlign === align
                      ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-xs'
                      : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Layout & Box Model */}
        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-[#1A1A1A]" /> Spacing & Padding
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Padding Top</label>
              <input
                type="text"
                value={selectedElement.styles.paddingTop || '16px'}
                onChange={(e) => updateStyles('paddingTop', e.target.value)}
                className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-1 text-xs text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#1A1A1A]/70 mb-1 uppercase tracking-wider">Padding Bottom</label>
              <input
                type="text"
                value={selectedElement.styles.paddingBottom || '16px'}
                onChange={(e) => updateStyles('paddingBottom', e.target.value)}
                className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-1 text-xs text-[#1A1A1A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onMoveUp(selectedElement.id)}
            className="py-2 bg-[#E5E2D9] hover:bg-[#DED9CE] text-[#1A1A1A] rounded-full text-xs font-semibold uppercase tracking-wider border border-[#1A1A1A]/10 flex items-center justify-center gap-1"
          >
            <ChevronUp className="w-3.5 h-3.5" /> Move Up
          </button>
          <button
            onClick={() => onMoveDown(selectedElement.id)}
            className="py-2 bg-[#E5E2D9] hover:bg-[#DED9CE] text-[#1A1A1A] rounded-full text-xs font-semibold uppercase tracking-wider border border-[#1A1A1A]/10 flex items-center justify-center gap-1"
          >
            <ChevronDown className="w-3.5 h-3.5" /> Move Down
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onDuplicate(selectedElement.id)}
            className="py-2 bg-[#E5E2D9] hover:bg-[#DED9CE] text-[#1A1A1A] rounded-full text-xs font-semibold uppercase tracking-wider border border-[#1A1A1A]/10 flex items-center justify-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate
          </button>
          <button
            onClick={() => onDelete(selectedElement.id)}
            className="py-2 bg-[#E5E2D9] hover:bg-rose-100 text-rose-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#1A1A1A]/10 flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </aside>
  );
};
