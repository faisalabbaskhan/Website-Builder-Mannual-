import React, { useState } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Save,
  Download,
  Plus,
  Check,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Project, DeviceMode, WebPage } from '../../types';

interface EditorToolbarProps {
  project: Project;
  activePageId: string;
  deviceMode: DeviceMode;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  isSaved: boolean;
  onBackToDashboard: () => void;
  onPageChange: (pageId: string) => void;
  onAddPage: () => void;
  onDeviceChange: (mode: DeviceMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPreview: () => void;
  onExportZip: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  project,
  activePageId,
  deviceMode,
  canUndo,
  canRedo,
  isSaving,
  isSaved,
  onBackToDashboard,
  onPageChange,
  onAddPage,
  onDeviceChange,
  onUndo,
  onRedo,
  onSave,
  onPreview,
  onExportZip,
}) => {
  return (
    <header className="h-16 bg-[#F9F7F2] border-b border-[#1A1A1A]/10 px-4 flex items-center justify-between sticky top-0 z-30 select-none text-[#1A1A1A]">
      {/* Left: Back + Project Name + Page Dropdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="p-2 hover:bg-[#E5E2D9] rounded-full text-[#1A1A1A] transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Archive</span>
        </button>

        <div className="h-5 w-px bg-[#1A1A1A]/10" />

        <div className="flex items-center gap-2">
          <span className="font-serif italic text-[#1A1A1A] text-lg truncate max-w-[140px] sm:max-w-[200px]">
            {project.name}
          </span>

          {/* Page Switcher */}
          <div className="relative flex items-center bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-full px-3 py-1">
            <select
              value={activePageId}
              onChange={(e) => {
                if (e.target.value === 'ADD_PAGE') {
                  onAddPage();
                } else {
                  onPageChange(e.target.value);
                }
              }}
              className="bg-transparent text-xs font-semibold text-[#1A1A1A] focus:outline-none cursor-pointer pr-1 uppercase tracking-wider"
            >
              {project.pages.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#F9F7F2] text-[#1A1A1A]">
                  📄 {p.name} {p.isHomePage ? '(Home)' : ''}
                </option>
              ))}
              <option value="ADD_PAGE" className="bg-[#F9F7F2] text-[#1A1A1A] font-bold">
                + Add New Page...
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Center: Device Viewport Switcher + Undo/Redo */}
      <div className="flex items-center gap-3">
        {/* Undo / Redo */}
        <div className="flex items-center bg-[#E5E2D9] p-1 rounded-full border border-[#1A1A1A]/10">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 hover:bg-[#F9F7F2] rounded-full text-[#1A1A1A] disabled:opacity-30 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 hover:bg-[#F9F7F2] rounded-full text-[#1A1A1A] disabled:opacity-30 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Device Mode Viewports */}
        <div className="hidden md:flex items-center bg-[#E5E2D9] p-1 rounded-full border border-[#1A1A1A]/10">
          <button
            onClick={() => onDeviceChange('desktop')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all uppercase tracking-wider ${
              deviceMode === 'desktop'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => onDeviceChange('tablet')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all uppercase tracking-wider ${
              deviceMode === 'tablet'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => onDeviceChange('mobile')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all uppercase tracking-wider ${
              deviceMode === 'mobile'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Right: Preview + Save + Download ZIP */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          className="px-3 py-2 bg-[#E5E2D9] hover:bg-[#DED9CE] text-[#1A1A1A] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors uppercase tracking-wider border border-[#1A1A1A]/10"
          title="Live Interactive Preview"
        >
          <Eye className="w-4 h-4 text-[#1A1A1A]" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          onClick={onSave}
          className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all uppercase tracking-wider ${
            isSaved
              ? 'bg-[#E5E2D9] text-[#1A1A1A] border border-[#1A1A1A]/30'
              : 'bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] shadow-md'
          }`}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Saved' : isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        <button
          onClick={onExportZip}
          className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all uppercase tracking-wider"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">Export ZIP</span>
        </button>
      </div>
    </header>
  );
};
