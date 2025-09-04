import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Instrument {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  type: 'survey' | 'interview' | 'observation' | 'scale' | 'test';
  questions: any;
  validation_data: any;
  metadata: any;
  status: 'draft' | 'validated' | 'active' | 'completed' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useInstruments = (projectId?: string) => {
  const { user } = useAuth();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId && user) {
      fetchInstruments();
    } else {
      setInstruments([]);
      setLoading(false);
    }
  }, [projectId, user]);

  const fetchInstruments = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setInstruments(data || []);
    } catch (err) {
      console.error('Error fetching instruments:', err);
      setError(err instanceof Error ? err.message : 'Error loading instruments');
      setInstruments([]);
    } finally {
      setLoading(false);
    }
  };

  const createInstrument = async (instrumentData: {
    name: string;
    description?: string;
    type: 'survey' | 'interview' | 'observation' | 'scale' | 'test';
    questions?: any;
    metadata?: any;
  }) => {
    if (!projectId || !user?.id) {
      return { data: null, error: new Error('Missing project or user') };
    }

    try {
      const { data, error } = await supabase
        .from('instruments')
        .insert({
          project_id: projectId,
          name: instrumentData.name,
          description: instrumentData.description || null,
          type: instrumentData.type,
          questions: instrumentData.questions || [],
          validation_data: {},
          metadata: instrumentData.metadata || {},
          status: 'draft',
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setInstruments(prev => [data, ...prev]);
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creating instrument');
      return { data: null, error };
    }
  };

  const updateInstrument = async (instrumentId: string, updates: Partial<Instrument>) => {
    try {
      const { data, error } = await supabase
        .from('instruments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', instrumentId)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setInstruments(prev => prev.map(inst => 
          inst.id === instrumentId ? data : inst
        ));
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error updating instrument');
      return { data: null, error };
    }
  };

  const deleteInstrument = async (instrumentId: string) => {
    try {
      const { error } = await supabase
        .from('instruments')
        .delete()
        .eq('id', instrumentId);

      if (error) throw error;
      
      setInstruments(prev => prev.filter(inst => inst.id !== instrumentId));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error deleting instrument');
      return { error };
    }
  };

  return {
    instruments,
    loading,
    error,
    createInstrument,
    updateInstrument,
    deleteInstrument,
    refetch: fetchInstruments
  };
};