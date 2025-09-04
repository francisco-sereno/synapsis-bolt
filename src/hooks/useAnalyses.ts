import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Analysis {
  id: string;
  project_id: string;
  name: string;
  type: string;
  dataset_id: string | null;
  parameters: any;
  results: any;
  interpretation: string | null;
  status: 'running' | 'completed' | 'failed';
  rating: number | null;
  exported: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useAnalyses = (projectId?: string) => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId && user) {
      fetchAnalyses();
    } else {
      setAnalyses([]);
      setLoading(false);
    }
  }, [projectId, user]);

  const fetchAnalyses = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError(err instanceof Error ? err.message : 'Error loading analyses');
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  const createAnalysis = async (analysisData: {
    name: string;
    type: string;
    dataset_id?: string;
    parameters?: any;
    results?: any;
    interpretation?: string;
  }) => {
    if (!projectId || !user?.id) {
      return { data: null, error: new Error('Missing project or user') };
    }

    try {
      const { data, error } = await supabase
        .from('analyses')
        .insert({
          project_id: projectId,
          name: analysisData.name,
          type: analysisData.type,
          dataset_id: analysisData.dataset_id || null,
          parameters: analysisData.parameters || {},
          results: analysisData.results || {},
          interpretation: analysisData.interpretation || null,
          status: 'running',
          rating: null,
          exported: false,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setAnalyses(prev => [data, ...prev]);
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creating analysis');
      return { data: null, error };
    }
  };

  const updateAnalysis = async (analysisId: string, updates: Partial<Analysis>) => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', analysisId)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setAnalyses(prev => prev.map(analysis => 
          analysis.id === analysisId ? data : analysis
        ));
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error updating analysis');
      return { data: null, error };
    }
  };

  return {
    analyses,
    loading,
    error,
    createAnalysis,
    updateAnalysis,
    refetch: fetchAnalyses
  };
};