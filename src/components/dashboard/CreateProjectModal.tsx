import React, { useState } from 'react';
import { X, Sparkles, LayoutTemplate, Check } from 'lucide-react';
import { STARTER_TEMPLATES } from '../../data/templates';
import { Project } from '../../types';
import { generateId } from '../../utils/idGenerator';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'business' | 'ecommerce' | 'portfolio' | 'saas' | 'blog' | 'general'>('saas');
  const [selectedTemplateId, setSelectedTemplateId] = useState('saas-nova');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const template = STARTER_TEMPLATES.find((t) => t.id === selectedTemplateId) || STARTER_TEMPLATES[0];

    const now = new Date().toISOString();
    const newProject: Project = {
      ...JSON.parse(JSON.stringify(template.projectData)),
      id: generateId('proj'),
      name: name.trim(),
      description: description.trim() || template.description,
      category,
      createdAt: now,
      updatedAt: now,
      thumbnail: template.thumbnail,
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F9F7F2] border border-[#1A1A1A]/20 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 text-[#1A1A1A]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-2 rounded-full hover:bg-[#E5E2D9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[#1A1A1A] mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">New Project Creation</span>
          </div>
          <h2 className="text-3xl font-serif italic text-[#1A1A1A]">Build New Website</h2>
          <p className="text-xs text-[#1A1A1A]/70 mt-1">
            Give your project a title and select a preset or blank atelier canvas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80 mb-1">
                Website Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Atelier Luminaria"
                className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="saas">SaaS / Tech</option>
                <option value="ecommerce">E-Commerce / Store</option>
                <option value="portfolio">Portfolio / Creative</option>
                <option value="business">Business / Agency</option>
                <option value="general">General / Landing Page</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80 mb-1">
              Short Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Contemporary design portfolio showcase"
              className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/15 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {/* Starter Template Selection Grid */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80 mb-3 flex items-center gap-1.5">
              <LayoutTemplate className="w-4 h-4 text-[#1A1A1A]" /> Choose Starter Preset
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-1">
              {STARTER_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`cursor-pointer rounded-2xl border p-3 flex gap-3 transition-all relative ${
                      isSelected
                        ? 'border-[#1A1A1A] bg-[#E5E2D9] shadow-sm'
                        : 'border-[#1A1A1A]/10 bg-[#E5E2D9]/50 hover:bg-[#E5E2D9]'
                    }`}
                  >
                    <img
                      src={tmpl.thumbnail}
                      alt={tmpl.name}
                      className="w-20 h-16 object-cover rounded-xl shrink-0 border border-[#1A1A1A]/10"
                    />
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-xs font-serif italic text-[#1A1A1A] truncate">{tmpl.name}</h4>
                      <p className="text-[11px] text-[#1A1A1A]/70 line-clamp-2 mt-0.5">{tmpl.description}</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#E5E2D9] hover:bg-[#DED9CE] text-[#1A1A1A] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border border-[#1A1A1A]/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-50 text-[#F9F7F2] rounded-full text-xs font-semibold shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" /> Open Atelier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
