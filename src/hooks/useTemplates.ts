import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  type: 'survey' | 'interview' | 'observation' | 'scale' | 'test';
  questions: Record<string, unknown>;
  metadata: Record<string, unknown>;
  usage_count: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch both public templates and user's own templates
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .or(`is_public.eq.true,created_by.eq.${user?.id}`)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err instanceof Error ? err.message : 'Error loading templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTemplates();
    } else {
      setTemplates([]);
      setLoading(false);
    }
  }, [user, fetchTemplates]);

  const createTemplate = async (templateData: {
    name: string;
    description?: string;
    category: string;
    type: 'survey' | 'interview' | 'observation' | 'scale' | 'test';
    questions?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    is_public?: boolean;
  }) => {
    if (!user?.id) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('templates')
        .insert({
          name: templateData.name,
          description: templateData.description || null,
          category: templateData.category,
          type: templateData.type,
          questions: templateData.questions || [],
          metadata: templateData.metadata || {},
          usage_count: 0,
          is_public: templateData.is_public || false,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setTemplates(prev => [data, ...prev]);
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creating template');
      return { data: null, error };
    }
  };

  const useTemplate = async (templateId: string) => {
    try {
      // Increment usage count
      const { error } = await supabase
        .from('templates')
        .update({ usage_count: supabase.sql`usage_count + 1` })
        .eq('id', templateId);

      if (error) throw error;
      
      // Update local state
      setTemplates(prev => prev.map(template => 
        template.id === templateId 
          ? { ...template, usage_count: template.usage_count + 1 }
          : template
      ));
      
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error updating template usage');
      return { error };
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error deleting template');
      return { error };
    }
  };

  return {
    templates,
    loading,
    error,
    createTemplate,
    useTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};