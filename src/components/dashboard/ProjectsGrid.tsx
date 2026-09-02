import React, { useState } from 'react';
import { Edit3, ExternalLink, Download, Copy, Trash2, Plus, Globe, Layers, Clock, AlertTriangle } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsGridProps {
  projects: Project[];
  searchQuery: string;
  onEditProject: (project: Project) => void;
  onPreviewProject: (project: Project) => void;
  onExportProjectZip: (project: Project) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateNewProject: () => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  searchQuery,
  onEditProject,
  onPreviewProject,
  onExportProjectZip,
  onDuplicateProject,
  onDeleteProject,
  onCreateNewProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = ['all', 'saas', 'ecommerce', 'portfolio', 'business'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Category Filter Pills & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
        <div>
          <h1 className="text-3xl font-serif italic text-[#1A1A1A]">Website Archive</h1>
          <p className="text-xs uppercase tracking-widest text-[#1A1A1A]/60 mt-1">
            Curate, edit, preview, and export website code.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#E5E2D9] p-1 rounded-full border border-[#1A1A1A]/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-2xl overflow-hidden hover:border-[#1A1A1A]/30 transition-all shadow-md group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-48 bg-[#F9F7F2] overflow-hidden border-b border-[#1A1A1A]/10">
                  <img
                    src={
                      project.thumbnail ||
                      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#F9F7F2]/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A] rounded-full border border-[#1A1A1A]/20">
                      {project.category}
                    </span>
                    <span
                      className={`px-2.5 py-1 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest rounded-full border ${
                        project.status === 'published'
                          ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A]'
                          : 'bg-[#E5E2D9] text-[#1A1A1A] border-[#1A1A1A]/30'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Primary Hover Edit Overlay */}
                  <div className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditProject(project)}
                      className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] rounded-full font-semibold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 uppercase tracking-wider"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Open Atelier
                    </button>
                    <button
                      onClick={() => onPreviewProject(project)}
                      className="p-2 bg-[#F9F7F2] hover:bg-[#E5E2D9] text-[#1A1A1A] rounded-full text-xs border border-[#1A1A1A]/20 shadow-lg"
                      title="Live Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5">
                  <h3 className="font-serif italic text-[#1A1A1A] text-xl group-hover:underline underline-offset-4 decoration-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 mt-1 line-clamp-2">
                    {project.description || 'No description added for this project.'}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-[#1A1A1A]/60 mt-4 pt-3 border-t border-[#1A1A1A]/10 font-mono uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#1A1A1A]" /> {project.pages.length} Pages
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1A1A1A]" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-[#F9F7F2] border-t border-[#1A1A1A]/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onEditProject(project)}
                  className="flex-1 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>

                <button
                  onClick={() => onExportProjectZip(project)}
                  className="p-2 bg-[#E5E2D9] hover:bg-[#DED9CE] text-[#1A1A1A] rounded-full text-xs border border-[#1A1A1A]/10 transition-colors"
                  title="Export Code (.ZIP)"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDuplicateProject(project.id)}
                  className="p-2 bg-[#E5E2D9] hover:bg-[#DED9CE] text-[#1A1A1A] rounded-full text-xs border border-[#1A1A1A]/10 transition-colors"
                  title="Duplicate Project"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDeleteConfirmId(project.id)}
                  className="p-2 bg-[#E5E2D9] hover:bg-rose-100 text-rose-700 rounded-full text-xs border border-[#1A1A1A]/10 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-2xl max-w-lg mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-full bg-[#F9F7F2] border border-[#1A1A1A]/20 text-[#1A1A1A] flex items-center justify-center mx-auto shadow-sm">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif italic text-[#1A1A1A]">No Projects Found</h3>
          <p className="text-xs text-[#1A1A1A]/70">
            {searchQuery
              ? `No websites matched "${searchQuery}". Try a different search term.`
              : 'You haven\'t created any website projects yet. Start with a blank canvas or atelier preset.'}
          </p>
          <button
            onClick={onCreateNewProject}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] rounded-full text-xs font-semibold shadow-md inline-flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Create Website
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#F9F7F2] border border-[#1A1A1A]/20 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-serif italic text-[#1A1A1A]">Delete Website?</h3>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              Are you sure you want to delete this website project? This action cannot be undone.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-[#E5E2D9] hover:bg-[#DED9CE] text-[#1A1A1A] rounded-full text-xs font-semibold uppercase tracking-wider border border-[#1A1A1A]/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 bg-rose-700 hover:bg-rose-800 text-[#F9F7F2] rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
