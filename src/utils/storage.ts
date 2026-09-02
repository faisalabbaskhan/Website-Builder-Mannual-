import { Project, User, MediaAsset, StoreProduct } from '../types';
import { STARTER_TEMPLATES } from '../data/templates';
import { generateId } from './idGenerator';

const PROJECTS_STORAGE_KEY = 'webforge_projects_v1';
const USER_STORAGE_KEY = 'webforge_user_v1';
const MEDIA_STORAGE_KEY = 'webforge_media_v1';

export const DEFAULT_USER: User = {
  id: 'user_demo_1',
  name: 'Alex Vance',
  email: 'alex.vance@webforge.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

// Default sample projects if storage is empty
export function getInitialProjects(): Project[] {
  const saasTemplate = STARTER_TEMPLATES.find((t) => t.id === 'saas-nova')!;
  const luxeTemplate = STARTER_TEMPLATES.find((t) => t.id === 'luxe-store')!;

  const now = new Date().toISOString();

  const p1: Project = {
    ...saasTemplate.projectData,
    id: 'proj_saas_demo',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: now,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  };

  const p2: Project = {
    ...luxeTemplate.projectData,
    id: 'proj_store_demo',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: now,
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
  };

  return [p1, p2];
}

export function loadStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialProjects();
      saveStoredProjects(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getInitialProjects();
  } catch (err) {
    console.error('Error loading stored projects:', err);
    return getInitialProjects();
  }
}

export function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
}

export function saveProject(updatedProject: Project): Project[] {
  const projects = loadStoredProjects();
  const index = projects.findIndex((p) => p.id === updatedProject.id);
  
  const modified: Project = {
    ...updatedProject,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    projects[index] = modified;
  } else {
    projects.unshift(modified);
  }

  saveStoredProjects(projects);
  return projects;
}

export function deleteProject(projectId: string): Project[] {
  const projects = loadStoredProjects();
  const filtered = projects.filter((p) => p.id !== projectId);
  saveStoredProjects(filtered);
  return filtered;
}

export function duplicateProject(projectId: string): Project[] {
  const projects = loadStoredProjects();
  const target = projects.find((p) => p.id === projectId);
  if (!target) return projects;

  const now = new Date().toISOString();
  const newProj: Project = {
    ...JSON.parse(JSON.stringify(target)),
    id: generateId('proj'),
    name: `${target.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  projects.unshift(newProj);
  saveStoredProjects(projects);
  return projects;
}

// User Auth Persistence
export function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function saveStoredUser(user: User | null): void {
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
  } else {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

// Global Media Asset Storage
export function loadMediaAssets(): MediaAsset[] {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (!raw) {
      const defaultMedia: MediaAsset[] = [
        {
          id: 'm1',
          name: 'Hero SaaS Banner.jpg',
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          type: 'image',
          size: 480000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm2',
          name: 'Fashion Collection.jpg',
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
          type: 'image',
          size: 620000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm3',
          name: 'Silk Jacket.jpg',
          url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
          type: 'image',
          size: 340000,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(defaultMedia));
      return defaultMedia;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMediaAsset(asset: MediaAsset): MediaAsset[] {
  const current = loadMediaAssets();
  const updated = [asset, ...current];
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
