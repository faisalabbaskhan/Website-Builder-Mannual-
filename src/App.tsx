import React, { useState, useEffect } from 'react';
import { User, Project, WebPage, CanvasElement, DeviceMode, ProjectSettings, StoreProduct } from './types';
import {
  loadStoredUser,
  saveStoredUser,
  loadStoredProjects,
  saveProject,
  deleteProject as deleteStoredProject,
  duplicateProject as duplicateStoredProject,
} from './utils/storage';
import { exportProjectToZip } from './utils/codeExporter';
import { generateId } from './utils/idGenerator';

// Components
import { AuthPage } from './components/auth/AuthPage';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { DashboardSidebar, DashboardTab } from './components/dashboard/DashboardSidebar';
import { ProjectsGrid } from './components/dashboard/ProjectsGrid';
import { CreateProjectModal } from './components/dashboard/CreateProjectModal';
import { MediaLibraryView } from './components/dashboard/MediaLibraryView';
import { StoreManagerView } from './components/dashboard/StoreManagerView';

import { EditorToolbar } from './components/editor/EditorToolbar';
import { LeftPanel } from './components/editor/LeftPanel/LeftPanel';
import { CanvasArea } from './components/editor/Canvas/CanvasArea';
import { RightPanel } from './components/editor/RightPanel/RightPanel';
import { LivePreviewModal } from './components/preview/LivePreviewModal';

export function App() {
  const [user, setUser] = useState<User | null>(loadStoredUser());
  const [viewMode, setViewMode] = useState<'dashboard' | 'editor'>(user ? 'dashboard' : 'dashboard');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('projects');
  const [searchQuery, setSearchQuery] = useState('');

  // Projects State
  const [projects, setProjects] = useState<Project[]>(loadStoredProjects());
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activePageId, setActivePageId] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);

  // Editor State
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [historyStack, setHistoryStack] = useState<Project[]>([]);
  const [redoStack, setRedoStack] = useState<Project[]>([]);
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Handle Authentication
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    saveStoredUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    saveStoredUser(null);
  };

  // Save current project state to history stack before mutate
  const recordHistory = (proj: Project) => {
    setHistoryStack((prev) => [...prev.slice(-15), JSON.parse(JSON.stringify(proj))]);
    setRedoStack([]);
    setIsSaved(false);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyStack.length === 0 || !activeProject) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack((prev) => [JSON.parse(JSON.stringify(activeProject)), ...prev]);
    setActiveProject(previous);
    setHistoryStack((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0 || !activeProject) return;
    const next = redoStack[0];
    setHistoryStack((prev) => [...prev, JSON.parse(JSON.stringify(activeProject))]);
    setActiveProject(next);
    setRedoStack((prev) => prev.slice(1));
  };

  // Open Editor for Project
  const handleEditProject = (project: Project) => {
    setActiveProject(project);
    const homePage = project.pages.find((p) => p.isHomePage) || project.pages[0];
    setActivePageId(homePage ? homePage.id : '');
    setSelectedElement(null);
    setHistoryStack([]);
    setRedoStack([]);
    setIsSaved(true);
    setViewMode('editor');
  };

  // Save Project
  const handleSaveProject = () => {
    if (!activeProject) return;
    setIsSaving(true);
    const updatedList = saveProject(activeProject);
    setProjects(updatedList);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 400);
  };

  // Export Code (.ZIP)
  const handleExportZip = async (projectToExport?: Project) => {
    const target = projectToExport || activeProject;
    if (!target) return;

    try {
      const zipBlob = await exportProjectToZip(target);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${target.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-export.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export website zip:', err);
      alert('Error generating website zip package.');
    }
  };

  // Delete & Duplicate Projects
  const handleDeleteProject = (projectId: string) => {
    const updated = deleteStoredProject(projectId);
    setProjects(updated);
  };

  const handleDuplicateProject = (projectId: string) => {
    const updated = duplicateStoredProject(projectId);
    setProjects(updated);
  };

  // Add Element to Canvas Page
  const handleAddElement = (element: CanvasElement) => {
    if (!activeProject) return;
    recordHistory(activeProject);

    const updatedPages = activeProject.pages.map((page) => {
      if (page.id === activePageId) {
        return {
          ...page,
          elements: [...page.elements, element],
        };
      }
      return page;
    });

    const updatedProj = { ...activeProject, pages: updatedPages };
    setActiveProject(updatedProj);
    setSelectedElement(element);
  };

  // Update Element
  const handleUpdateElement = (updatedElement: CanvasElement) => {
    if (!activeProject) return;
    recordHistory(activeProject);

    const updatedPages = activeProject.pages.map((page) => {
      if (page.id === activePageId) {
        return {
          ...page,
          elements: page.elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
        };
      }
      return page;
    });

    const updatedProj = { ...activeProject, pages: updatedPages };
    setActiveProject(updatedProj);
    setSelectedElement(updatedElement);
  };

  // Move Element Up/Down
  const handleMoveElement = (id: string, direction: 'up' | 'down') => {
    if (!activeProject) return;
    recordHistory(activeProject);

    const activePage = activeProject.pages.find((p) => p.id === activePageId);
    if (!activePage) return;

    const elements = [...activePage.elements];
    const index = elements.findIndex((el) => el.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= elements.length) return;

    const temp = elements[index];
    elements[index] = elements[targetIndex];
    elements[targetIndex] = temp;

    const updatedPages = activeProject.pages.map((p) => (p.id === activePageId ? { ...p, elements } : p));
    setActiveProject({ ...activeProject, pages: updatedPages });
  };

  // Duplicate Element
  const handleDuplicateElement = (id: string) => {
    if (!activeProject) return;
    recordHistory(activeProject);

    const activePage = activeProject.pages.find((p) => p.id === activePageId);
    if (!activePage) return;

    const target = activePage.elements.find((el) => el.id === id);
    if (!target) return;

    const clone: CanvasElement = {
      ...JSON.parse(JSON.stringify(target)),
      id: generateId(target.type),
      name: `${target.name} (Copy)`,
    };

    const elements = [...activePage.elements, clone];
    const updatedPages = activeProject.pages.map((p) => (p.id === activePageId ? { ...p, elements } : p));
    setActiveProject({ ...activeProject, pages: updatedPages });
  };

  // Delete Element
  const handleDeleteElement = (id: string) => {
    if (!activeProject) return;
    recordHistory(activeProject);

    const updatedPages = activeProject.pages.map((p) => {
      if (p.id === activePageId) {
        return { ...p, elements: p.elements.filter((el) => el.id !== id) };
      }
      return p;
    });

    setActiveProject({ ...activeProject, pages: updatedPages });
    if (selectedElement?.id === id) setSelectedElement(null);
  };

  // Page Management
  const handleAddPage = (newPage: WebPage) => {
    if (!activeProject) return;
    recordHistory(activeProject);
    const updatedProj = { ...activeProject, pages: [...activeProject.pages, newPage] };
    setActiveProject(updatedProj);
    setActivePageId(newPage.id);
  };

  const handleDeletePage = (pageId: string) => {
    if (!activeProject || activeProject.pages.length <= 1) return;
    recordHistory(activeProject);
    const updatedPages = activeProject.pages.filter((p) => p.id !== pageId);
    setActiveProject({ ...activeProject, pages: updatedPages });
    setActivePageId(updatedPages[0].id);
  };

  const handleDuplicatePage = (pageId: string) => {
    if (!activeProject) return;
    recordHistory(activeProject);
    const targetPage = activeProject.pages.find((p) => p.id === pageId);
    if (!targetPage) return;

    const clone: WebPage = {
      ...JSON.parse(JSON.stringify(targetPage)),
      id: generateId('page'),
      name: `${targetPage.name} Copy`,
      slug: `${targetPage.slug}-copy`,
      isHomePage: false,
    };

    setActiveProject({ ...activeProject, pages: [...activeProject.pages, clone] });
  };

  const handleSetHomePage = (pageId: string) => {
    if (!activeProject) return;
    recordHistory(activeProject);
    const updatedPages = activeProject.pages.map((p) => ({
      ...p,
      isHomePage: p.id === pageId,
    }));
    setActiveProject({ ...activeProject, pages: updatedPages });
  };

  // Update Settings
  const handleUpdateSettings = (updatedSettings: Partial<ProjectSettings>) => {
    if (!activeProject) return;
    recordHistory(activeProject);
    setActiveProject({
      ...activeProject,
      settings: { ...activeProject.settings, ...updatedSettings },
    });
  };

  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  const activePage = activeProject?.pages.find((p) => p.id === activePageId) || activeProject?.pages[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {viewMode === 'dashboard' ? (
        /* ================= DASHBOARD VIEW ================= */
        <div className="flex flex-col min-h-screen">
          <DashboardHeader
            user={user}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateNewProject={() => setShowCreateModal(true)}
            onLogout={handleLogout}
          />

          <div className="flex-1 flex">
            <DashboardSidebar
              activeTab={dashboardTab}
              onSelectTab={setDashboardTab}
              projectCount={projects.length}
            />

            <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
              {dashboardTab === 'projects' && (
                <ProjectsGrid
                  projects={projects}
                  searchQuery={searchQuery}
                  onEditProject={handleEditProject}
                  onPreviewProject={(p) => {
                    setActiveProject(p);
                    setShowPreviewModal(true);
                  }}
                  onExportProjectZip={(p) => handleExportZip(p)}
                  onDuplicateProject={handleDuplicateProject}
                  onDeleteProject={handleDeleteProject}
                  onCreateNewProject={() => setShowCreateModal(true)}
                />
              )}

              {dashboardTab === 'templates' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-800">
                    <h1 className="text-2xl font-bold">Starter Website Templates</h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Pick a starter website design to instantly launch a new project.
                    </p>
                  </div>
                  <CreateProjectModal
                    isOpen={true}
                    onClose={() => setDashboardTab('projects')}
                    onCreateProject={(proj) => {
                      const updated = saveProject(proj);
                      setProjects(updated);
                      handleEditProject(proj);
                    }}
                  />
                </div>
              )}

              {dashboardTab === 'media' && <MediaLibraryView />}
              {dashboardTab === 'store' && <StoreManagerView />}

              {dashboardTab === 'settings' && (
                <div className="space-y-6 max-w-xl">
                  <div className="pb-4 border-b border-slate-800">
                    <h1 className="text-2xl font-bold">Workspace Settings</h1>
                    <p className="text-xs text-slate-400 mt-1">Manage platform profile and preferences.</p>
                  </div>
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Account User</label>
                      <p className="text-sm font-bold text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      ) : (
        /* ================= WEBSITE BUILDER EDITOR ================= */
        activeProject && (
          <div className="flex flex-col h-screen overflow-hidden">
            <EditorToolbar
              project={activeProject}
              activePageId={activePageId}
              deviceMode={deviceMode}
              canUndo={historyStack.length > 0}
              canRedo={redoStack.length > 0}
              isSaving={isSaving}
              isSaved={isSaved}
              onBackToDashboard={() => {
                saveProject(activeProject);
                setViewMode('dashboard');
              }}
              onPageChange={setActivePageId}
              onAddPage={() => {
                const name = prompt('Enter new page name (e.g. Services):');
                if (name) {
                  handleAddPage({
                    id: generateId('page'),
                    name,
                    slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    title: `${name} Page`,
                    elements: [],
                  });
                }
              }}
              onDeviceChange={setDeviceMode}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onSave={handleSaveProject}
              onPreview={() => setShowPreviewModal(true)}
              onExportZip={() => handleExportZip()}
            />

            <div className="flex-1 flex overflow-hidden">
              <LeftPanel
                pages={activeProject.pages}
                activePageId={activePageId}
                elements={activePage ? activePage.elements : []}
                selectedElement={selectedElement}
                products={activeProject.products}
                settings={activeProject.settings}
                onAddElement={handleAddElement}
                onSelectPage={setActivePageId}
                onAddPage={handleAddPage}
                onDeletePage={handleDeletePage}
                onDuplicatePage={handleDuplicatePage}
                onSetHomePage={handleSetHomePage}
                onSelectElement={setSelectedElement}
                onMoveElementUp={(id) => handleMoveElement(id, 'up')}
                onMoveElementDown={(id) => handleMoveElement(id, 'down')}
                onDeleteElement={handleDeleteElement}
                onUpdateElementSrc={(src) => {
                  if (selectedElement) {
                    handleUpdateElement({ ...selectedElement, src });
                  }
                }}
                onBindProduct={(prod) => {
                  if (selectedElement) {
                    handleUpdateElement({
                      ...selectedElement,
                      productId: prod.id,
                      productPrice: prod.price,
                      productSalePrice: prod.salePrice,
                      productImage: prod.image,
                      content: prod.name,
                    });
                  }
                }}
                onUpdateSettings={handleUpdateSettings}
              />

              <CanvasArea
                project={activeProject}
                activePage={activePage || activeProject.pages[0]}
                deviceMode={deviceMode}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onMoveUp={(id) => handleMoveElement(id, 'up')}
                onMoveDown={(id) => handleMoveElement(id, 'down')}
                onDuplicate={handleDuplicateElement}
                onDelete={handleDeleteElement}
              />

              <RightPanel
                selectedElement={selectedElement}
                project={activeProject}
                onUpdateElement={handleUpdateElement}
                onMoveUp={(id) => handleMoveElement(id, 'up')}
                onMoveDown={(id) => handleMoveElement(id, 'down')}
                onDuplicate={handleDuplicateElement}
                onDelete={handleDeleteElement}
              />
            </div>
          </div>
        )
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={(newProj) => {
          const updated = saveProject(newProj);
          setProjects(updated);
          handleEditProject(newProj);
        }}
      />

      {activeProject && (
        <LivePreviewModal
          project={activeProject}
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}

export default App;
