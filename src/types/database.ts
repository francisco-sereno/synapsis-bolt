export interface Project {
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
  project_collaborators?: any[];
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  institution: string | null;
  department: string | null;
  position: string | null;
  orcid: string | null;
  role: 'admin' | 'researcher' | 'collaborator';
  avatar_url: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

export interface Instrument {
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

export interface Collaborator {
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
  profiles?: {
    full_name: string;
    email: string;
    institution: string | null;
    position: string | null;
  };
}

export interface Analysis {
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

export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  type: 'survey' | 'interview' | 'observation' | 'scale' | 'test';
  questions: any;
  metadata: any;
  usage_count: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}