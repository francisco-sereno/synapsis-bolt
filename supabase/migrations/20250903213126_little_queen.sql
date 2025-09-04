/*
  # Create analyses table

  1. New Tables
    - `analyses`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `name` (text, not null)
      - `type` (text, not null)
      - `dataset_id` (text)
      - `parameters` (jsonb)
      - `results` (jsonb)
      - `interpretation` (text)
      - `status` (enum: running, completed, failed)
      - `rating` (integer)
      - `exported` (boolean)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `analyses` table
    - Add policies for analysis access
*/

-- Create analysis status enum
CREATE TYPE analysis_status AS ENUM ('running', 'completed', 'failed');

-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  dataset_id text,
  parameters jsonb DEFAULT '{}',
  results jsonb DEFAULT '{}',
  interpretation text,
  status analysis_status DEFAULT 'running',
  rating integer CHECK (rating >= 1 AND rating <= 5),
  exported boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read analyses from their projects"
  ON analyses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = analyses.project_id AND user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Project members can create analyses"
  ON analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = analyses.project_id AND user_id = auth.uid() 
      AND status = 'accepted' AND role IN ('admin', 'editor', 'collaborator')
    )
  );

CREATE POLICY "Analysis creators can update their analyses"
  ON analyses
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Trigger to update updated_at
CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analyses_project_id ON analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_by ON analyses(created_by);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_type ON analyses(type);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);