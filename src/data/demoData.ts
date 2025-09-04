import { ResearchProject, Task, Collaborator } from '../types/research';

// Demo data for when Supabase is not configured
export const demoUser = {
  id: 'demo-user',
  email: 'demo@example.com',
  name: 'Demo User',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const demoProjects: ResearchProject[] = [];

export const demoTasks: Task[] = [];

export const demoCollaborators: Collaborator[] = [];