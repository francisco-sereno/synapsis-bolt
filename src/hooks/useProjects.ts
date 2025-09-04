import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  name: string;
  description: string | null;
  methodology: string;
  design: string;
  institution: string | null;
  principal_investigator: string;
  start_date: string | null;
  end_date: string | null;
  status: 'planificacion' | 'activo' | 'completado' | 'pausado';
  ethics_approval: string | null;
  visibility: 'private' | 'institutional' | 'public';
  settings: any;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setCurrentProject(null);
      setLoading(false);
      return;
    }

    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('principal_investigator', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Error loading projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: {
    name: string;
    description?: string;
    methodology: string;
    design: string;
    status?: 'planificacion' | 'activo' | 'completado' | 'pausado';
    institution?: string;
    start_date?: string;
    end_date?: string;
    ethics_approval?: string;
  }) => {
    if (!user?.id) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description || null,
          methodology: projectData.methodology,
          design: projectData.design,
          status: projectData.status || 'planificacion',
          institution: projectData.institution || null,
          principal_investigator: user.id,
          start_date: projectData.start_date || null,
          end_date: projectData.end_date || null,
          ethics_approval: projectData.ethics_approval || null,
          visibility: 'private',
          settings: {}
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setProjects(prev => [data, ...prev]);
        setCurrentProject(data);
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creating project');
      return { data: null, error };
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setProjects(prev => prev.map(project => 
          project.id === projectId ? data : project
        ));
        if (currentProject?.id === projectId) {
          setCurrentProject(data);
        }
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error updating project');
      return { data: null, error };
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      setProjects(prev => prev.filter(project => project.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error deleting project');
      return { error };
    }
  };

  return {
    projects,
    currentProject,
    setCurrentProject,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};