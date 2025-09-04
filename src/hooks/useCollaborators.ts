import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Collaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'collaborator' | 'viewer';
  permissions: any;
  invited_by: string;
  invited_at: string;
  joined_at: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  // Joined profile data
  profiles?: {
    full_name: string;
    email: string;
    institution: string | null;
    position: string | null;
  };
}

export const useCollaborators = (projectId?: string) => {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId && user) {
      fetchCollaborators();
    } else {
      setCollaborators([]);
      setLoading(false);
    }
  }, [projectId, user]);

  const fetchCollaborators = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_collaborators')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            institution,
            position
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollaborators(data || []);
    } catch (err) {
      console.error('Error fetching collaborators:', err);
      setError(err instanceof Error ? err.message : 'Error loading collaborators');
      setCollaborators([]);
    } finally {
      setLoading(false);
    }
  };

  const inviteCollaborator = async (email: string, role: 'admin' | 'editor' | 'collaborator' | 'viewer') => {
    if (!projectId || !user?.id) {
      return { data: null, error: new Error('Missing project or user') };
    }

    try {
      // First check if user exists
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (!existingUser) {
        return { data: null, error: new Error('User not found. They need to register first.') };
      }

      // Check if already invited
      const { data: existingInvite } = await supabase
        .from('project_collaborators')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', existingUser.id)
        .single();

      if (existingInvite) {
        return { data: null, error: new Error('User already invited to this project') };
      }

      // Create invitation
      const { data, error } = await supabase
        .from('project_collaborators')
        .insert({
          project_id: projectId,
          user_id: existingUser.id,
          role,
          permissions: {},
          invited_by: user.id,
          status: 'pending'
        })
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            institution,
            position
          )
        `)
        .single();

      if (error) throw error;
      
      if (data) {
        setCollaborators(prev => [data, ...prev]);
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error inviting collaborator');
      return { data: null, error };
    }
  };

  const updateCollaboratorRole = async (collaboratorId: string, role: 'admin' | 'editor' | 'collaborator' | 'viewer') => {
    try {
      const { data, error } = await supabase
        .from('project_collaborators')
        .update({ role })
        .eq('id', collaboratorId)
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            institution,
            position
          )
        `)
        .single();

      if (error) throw error;
      
      if (data) {
        setCollaborators(prev => prev.map(collab => 
          collab.id === collaboratorId ? data : collab
        ));
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error updating collaborator');
      return { data: null, error };
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('project_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;
      
      setCollaborators(prev => prev.filter(collab => collab.id !== collaboratorId));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error removing collaborator');
      return { error };
    }
  };

  return {
    collaborators,
    loading,
    error,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
    refetch: fetchCollaborators
  };
};