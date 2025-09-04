/*
  # Create methodology and analysis tables

  1. New Tables
    - `methodology_data`
      - Stores comprehensive methodology information for projects
      - Includes research problem, questions, objectives, justifications
      - Links to projects table
    - `methodology_analyses` 
      - Stores AI analysis results of methodology coherence
      - Includes scores, strengths, weaknesses, recommendations
      - Links to methodology_data and profiles

  2. Security
    - Enable RLS on both tables
    - Add policies for project members to manage methodology data
    - Add policies for reading analysis history
*/

-- Create methodology_data table
CREATE TABLE IF NOT EXISTS methodology_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  research_problem text NOT NULL,
  main_question text NOT NULL,
  secondary_questions text[] DEFAULT '{}',
  general_objective text NOT NULL,
  specific_objectives text[] DEFAULT '{}',
  theoretical_justification text DEFAULT '',
  practical_justification text DEFAULT '',
  ethical_considerations text DEFAULT '',
  paradigm text DEFAULT '',
  methodological_approach text DEFAULT '',
  design_characterization text DEFAULT '',
  design_justification text DEFAULT '',
  data_collection_techniques text DEFAULT '',
  dimensions_matrix jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create methodology_analyses table
CREATE TABLE IF NOT EXISTS methodology_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  methodology_data_id uuid REFERENCES methodology_data(id) ON DELETE CASCADE,
  coherence_score numeric(3,2) NOT NULL,
  strengths text[] DEFAULT '{}',
  weaknesses text[] DEFAULT '{}',
  recommendations text[] DEFAULT '{}',
  alignment_scores jsonb DEFAULT '{}',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE methodology_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE methodology_analyses ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_methodology_data_project_id ON methodology_data(project_id);
CREATE INDEX IF NOT EXISTS idx_methodology_data_updated_at ON methodology_data(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_methodology_analyses_project_id ON methodology_analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_methodology_analyses_created_at ON methodology_analyses(created_at DESC);

-- Create policies for methodology_data
CREATE POLICY "Project members can read methodology data"
  ON methodology_data
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = methodology_data.project_id 
      AND projects.principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_collaborators.project_id = methodology_data.project_id 
      AND project_collaborators.user_id = auth.uid() 
      AND project_collaborators.status = 'accepted'
    )
  );

CREATE POLICY "Project members can create methodology data"
  ON methodology_data
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = methodology_data.project_id 
      AND projects.principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_collaborators.project_id = methodology_data.project_id 
      AND project_collaborators.user_id = auth.uid() 
      AND project_collaborators.status = 'accepted'
      AND project_collaborators.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Project members can update methodology data"
  ON methodology_data
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = methodology_data.project_id 
      AND projects.principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_collaborators.project_id = methodology_data.project_id 
      AND project_collaborators.user_id = auth.uid() 
      AND project_collaborators.status = 'accepted'
      AND project_collaborators.role IN ('admin', 'editor')
    )
  );

-- Create policies for methodology_analyses
CREATE POLICY "Project members can read methodology analyses"
  ON methodology_analyses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = methodology_analyses.project_id 
      AND projects.principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_collaborators.project_id = methodology_analyses.project_id 
      AND project_collaborators.user_id = auth.uid() 
      AND project_collaborators.status = 'accepted'
    )
  );

CREATE POLICY "Project members can create methodology analyses"
  ON methodology_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = methodology_analyses.project_id 
      AND projects.principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_collaborators.project_id = methodology_analyses.project_id 
      AND project_collaborators.user_id = auth.uid() 
      AND project_collaborators.status = 'accepted'
      AND project_collaborators.role IN ('admin', 'editor', 'collaborator')
    )
  );

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_methodology_data_updated_at'
  ) THEN
    CREATE TRIGGER update_methodology_data_updated_at
      BEFORE UPDATE ON methodology_data
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;