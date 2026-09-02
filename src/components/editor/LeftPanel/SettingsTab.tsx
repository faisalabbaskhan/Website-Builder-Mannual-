import React from 'react';
import { Palette, Type, Globe } from 'lucide-react';
import { ProjectSettings } from '../../../types';

interface SettingsTabProps {
  settings: ProjectSettings;
  onUpdateSettings: (updated: Partial<ProjectSettings>) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onUpdateSettings }) => {
  const fonts = [
    { label: 'Cormorant Garamond (Artistic Serif)', value: 'Cormorant Garamond, serif' },
    { label: 'Playfair Display (Luxury Serif)', value: 'Playfair Display, serif' },
    { label: 'Plus Jakarta Sans (Clean Modern)', value: 'Plus Jakarta Sans, sans-serif' },
    { label: 'Space Grotesk (Tech / Creative)', value: 'Space Grotesk, sans-serif' },
  ];

  return (
    <div className="p-4 space-y-6 text-[#1A1A1A]">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80">Global Website Settings</h3>
        <p className="text-xs text-[#1A1A1A]/60 mt-0.5">Customize global styles, palette, and typography.</p>
      </div>

      {/* Primary & Accent Color */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#1A1A1A]" /> Theme Palette
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-2xl space-y-1">
            <span className="text-[10px] text-[#1A1A1A]/70 font-semibold uppercase tracking-wider">Primary Accent</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.primaryColor || '#1A1A1A'}
                onChange={(e) => onUpdateSettings({ primaryColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs font-mono text-[#1A1A1A] font-semibold">{settings.primaryColor}</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-2xl space-y-1">
            <span className="text-[10px] text-[#1A1A1A]/70 font-semibold uppercase tracking-wider">Secondary Accent</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.accentColor || '#333333'}
                onChange={(e) => onUpdateSettings({ accentColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs font-mono text-[#1A1A1A] font-semibold">{settings.accentColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Font Family Selector */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-[#1A1A1A]" /> Font Family
        </label>
        <select
          value={settings.fontFamily}
          onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
          className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
        >
          {fonts.map((f) => (
            <option key={f.value} value={f.value} className="bg-[#F9F7F2]">
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
