import { createClient, type Json } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          institution: string | null
          department: string | null
          position: string | null
          role: 'admin' | 'researcher' | 'collaborator'
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          institution?: string | null
          department?: string | null
          position?: string | null
          orcid?: string | null
          role?: 'admin' | 'researcher' | 'collaborator'
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          institution?: string | null
          department?: string | null
          position?: string | null
          orcid?: string | null
          role?: 'admin' | 'researcher' | 'collaborator'
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          methodology: string
          design: string
          institution: string | null
          principal_investigator: string
          start_date: string | null
          end_date: string | null
          status: 'planificacion' | 'activo' | 'completado' | 'pausado'
          ethics_approval: string | null
          visibility: 'private' | 'institutional' | 'public'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          methodology: string
          design: string
          institution?: string | null
          principal_investigator: string
          start_date?: string | null
          end_date?: string | null
          status?: 'planificacion' | 'activo' | 'completado' | 'pausado'
          ethics_approval?: string | null
          visibility?: 'private' | 'institutional' | 'public'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          methodology?: string
          design?: string
          institution?: string | null
          principal_investigator?: string
          start_date?: string | null
          end_date?: string | null
          status?: 'planificacion' | 'activo' | 'completado' | 'pausado'
          ethics_approval?: string | null
          visibility?: 'private' | 'institutional' | 'public'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      project_collaborators: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'admin' | 'editor' | 'collaborator' | 'viewer'
          permissions: Json
          invited_by: string
          invited_at: string
          joined_at: string | null
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'admin' | 'editor' | 'collaborator' | 'viewer'
          permissions?: Json
          invited_by: string
          invited_at?: string
          joined_at?: string | null
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'admin' | 'editor' | 'collaborator' | 'viewer'
          permissions?: Json
          invited_by?: string
          invited_at?: string
          joined_at?: string | null
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
      }
      instruments: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          type: 'survey' | 'interview' | 'observation' | 'scale' | 'test'
          questions: Json
          validation_data: Json
          metadata: Json
          status: 'draft' | 'validated' | 'active' | 'completed' | 'archived'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          type: 'survey' | 'interview' | 'observation' | 'scale' | 'test'
          questions?: Json
          validation_data?: Json
          metadata?: Json
          status?: 'draft' | 'validated' | 'active' | 'completed' | 'archived'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          type?: 'survey' | 'interview' | 'observation' | 'scale' | 'test'
          questions?: Json
          validation_data?: Json
          metadata?: Json
          status?: 'draft' | 'validated' | 'active' | 'completed' | 'archived'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      data_collections: {
        Row: {
          id: string
          instrument_id: string
          name: string
          description: string | null
          status: 'active' | 'paused' | 'completed' | 'cancelled'
          target_responses: number | null
          responses_count: number
          completion_rate: number
          settings: Json
          analytics: Json
          url_slug: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instrument_id: string
          name: string
          description?: string | null
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          target_responses?: number | null
          responses_count?: number
          completion_rate?: number
          settings?: Json
          analytics?: Json
          url_slug?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instrument_id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          target_responses?: number | null
          responses_count?: number
          completion_rate?: number
          settings?: Json
          analytics?: Json
          url_slug?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      responses: {
        Row: {
          id: string
          collection_id: string
          participant_id: string | null
          answers: Json
          metadata: Json
          start_time: string
          end_time: string | null
          completion_rate: number
          ip_address: string | null
          user_agent: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          participant_id?: string | null
          answers: Json
          metadata?: Json
          start_time?: string
          end_time?: string | null
          completion_rate?: number
          ip_address?: string | null
          user_agent?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          participant_id?: string | null
          answers?: Json
          metadata?: Json
          start_time?: string
          end_time?: string | null
          completion_rate?: number
          ip_address?: string | null
          user_agent?: string | null
          location?: string | null
          created_at?: string
        }
      }
      analyses: {
        Row: {
          id: string
          project_id: string
          name: string
          type: string
          dataset_id: string | null
          parameters: Json
          results: Json
          interpretation: string | null
          status: 'running' | 'completed' | 'failed'
          rating: number | null
          exported: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          type: string
          dataset_id?: string | null
          parameters?: Json
          results?: Json
          interpretation?: string | null
          status?: 'running' | 'completed' | 'failed'
          rating?: number | null
          exported?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          type?: string
          dataset_id?: string | null
          parameters?: Json
          results?: Json
          interpretation?: string | null
          status?: 'running' | 'completed' | 'failed'
          rating?: number | null
          exported?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          project_id: string
          name: string
          original_name: string
          type: string
          mime_type: string | null
          size: number
          storage_path: string
          url: string | null
          tags: string[] | null
          transcription: string | null
          extracted_text: string | null
          metadata: Json
          shared: boolean
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          original_name: string
          type: string
          mime_type?: string | null
          size: number
          storage_path: string
          url?: string | null
          tags?: string[] | null
          transcription?: string | null
          extracted_text?: string | null
          metadata?: Json
          shared?: boolean
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          original_name?: string
          type?: string
          mime_type?: string | null
          size?: number
          storage_path?: string
          url?: string | null
          tags?: string[] | null
          transcription?: string | null
          extracted_text?: string | null
          metadata?: Json
          shared?: boolean
          uploaded_by?: string
          created_at?: string
        }
      }
      triangulations: {
        Row: {
          id: string
          project_id: string
          name: string
          method: string
          sources: Json
          results: Json
          convergences: Json
          divergences: Json
          meta_inferences: string[] | null
          confidence_score: number | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          method: string
          sources?: Json
          results?: Json
          convergences?: Json
          divergences?: Json
          meta_inferences?: string[] | null
          confidence_score?: number | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          method?: string
          sources?: Json
          results?: Json
          convergences?: Json
          divergences?: Json
          meta_inferences?: string[] | null
          confidence_score?: number | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          project_id: string
          title: string
          type: string
          template: string
          content: Json
          sections: Json
          metadata: Json
          status: 'draft' | 'review' | 'published'
          download_count: number
          view_count: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          type: string
          template: string
          content?: Json
          sections?: Json
          metadata?: Json
          status?: 'draft' | 'review' | 'published'
          download_count?: number
          view_count?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          type?: string
          template?: string
          content?: Json
          sections?: Json
          metadata?: Json
          status?: 'draft' | 'review' | 'published'
          download_count?: number
          view_count?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json
          read: boolean
          action_url: string | null
          action_label: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json
          read?: boolean
          action_url?: string | null
          action_label?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json
          read?: boolean
          action_url?: string | null
          action_label?: string | null
          created_at?: string
        }
      }
      ai_requests: {
        Row: {
          id: string
          user_id: string
          project_id: string
          type: string
          input_data: Json
          output_data: Json | null
          processing_time: number | null
          tokens_used: number | null
          cost: number | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          error_message: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          type: string
          input_data: Json
          output_data?: Json | null
          processing_time?: number | null
          tokens_used?: number | null
          cost?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          type?: string
          input_data?: Json
          output_data?: Json | null
          processing_time?: number | null
          tokens_used?: number | null
          cost?: number | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      collaboration_activity: {
        Row: {
          id: string
          project_id: string
          user_id: string
          action: string
          target_type: string | null
          target_id: string | null
          target_name: string | null
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          action: string
          target_type?: string | null
          target_id?: string | null
          target_name?: string | null
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          action?: string
          target_type?: string | null
          target_id?: string | null
          target_name?: string | null
          details?: Json
          created_at?: string
        }
      }
      search_queries: {
        Row: {
          id: string
          user_id: string
          project_id: string
          query: string
          filters: Json
          results_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          query: string
          filters?: Json
          results_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          query?: string
          filters?: Json
          results_count?: number
          created_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          user_id: string
          project_id: string
          type: string
          priority: string
          title: string
          description: string
          action: string
          impact: string | null
          effort: string | null
          module: string | null
          dismissed: boolean
          dismissed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          type: string
          priority?: string
          title: string
          description: string
          action: string
          impact?: string | null
          effort?: string | null
          module?: string | null
          dismissed?: boolean
          dismissed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          type?: string
          priority?: string
          title?: string
          description?: string
          action?: string
          impact?: string | null
          effort?: string | null
          module?: string | null
          dismissed?: boolean
          dismissed_at?: string | null
          created_at?: string
        }
      }
      methodology_data: {
        Row: {
          id: string
          project_id: string
          research_problem: string
          main_question: string
          secondary_questions: string[]
          general_objective: string
          specific_objectives: string[]
          theoretical_justification: string
          practical_justification: string
          ethical_considerations: string
          paradigm: string
          methodological_approach: string
          design_characterization: string
          design_justification: string
          data_collection_techniques: string
          dimensions_matrix: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          research_problem: string
          main_question: string
          secondary_questions?: string[]
          general_objective: string
          specific_objectives?: string[]
          theoretical_justification?: string
          practical_justification?: string
          ethical_considerations?: string
          paradigm?: string
          methodological_approach?: string
          design_characterization?: string
          design_justification?: string
          data_collection_techniques?: string
          dimensions_matrix?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          research_problem?: string
          main_question?: string
          secondary_questions?: string[]
          general_objective?: string
          specific_objectives?: string[]
          theoretical_justification?: string
          practical_justification?: string
          ethical_considerations?: string
          paradigm?: string
          methodological_approach?: string
          design_characterization?: string
          design_justification?: string
          data_collection_techniques?: string
          dimensions_matrix?: Json
          created_at?: string
          updated_at?: string
        }
      }
      methodology_analyses: {
        Row: {
          id: string
          project_id: string
          methodology_data_id: string
          coherence_score: number
          strengths: string[]
          weaknesses: string[]
          recommendations: string[]
          alignment_scores: Json
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          methodology_data_id: string
          coherence_score: number
          strengths?: string[]
          weaknesses?: string[]
          recommendations?: string[]
          alignment_scores?: Json
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          methodology_data_id?: string
          coherence_score?: number
          strengths?: string[]
          weaknesses?: string[]
          recommendations?: string[]
          alignment_scores?: Json
          created_by?: string
          created_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          type: 'survey' | 'interview' | 'observation' | 'scale' | 'test'
          questions: Json
          metadata: Json
          usage_count: number
          is_public: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          type: 'survey' | 'interview' | 'observation' | 'scale' | 'test'
          questions?: Json
          metadata?: Json
          usage_count?: number
          is_public?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          type?: 'survey' | 'interview' | 'observation' | 'scale' | 'test'
          questions?: Json
          metadata?: Json
          usage_count?: number
          is_public?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseAnonKey.includes('placeholder'));
}