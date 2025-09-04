/*
  # Create instruments table

  1. New Tables
    - `instruments`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `name` (text, not null)
      - `description` (text)
      - `type` (enum: survey, interview, observation, scale, test)
      - `questions` (jsonb)
      - `validation_data` (jsonb)
      - `metadata` (jsonb)
      - `status` (enum: draft, validated, active, completed, archived)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `instruments` table
    - Add policies for instrument access based on project collaboration
*/

-- Create instrument type enum
CREATE TYPE instrument_type AS ENUM ('survey', 'interview', 'observation', 'scale', 'test');

-- Create instrument status enum
CREATE TYPE instrument_status AS ENUM ('draft', 'validated', 'active', 'completed', 'archived');

-- Create instruments table
CREATE TABLE IF NOT EXISTS instruments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type instrument_type DEFAULT 'survey',
  questions jsonb DEFAULT '[]',
  validation_data jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  status instrument_status DEFAULT 'draft',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read instruments from their projects"
  ON instruments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = instruments.project_id AND user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Project members can create instruments"
  ON instruments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = instruments.project_id AND user_id = auth.uid() 
      AND status = 'accepted' AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Instrument creators and project owners can update"
  ON instruments
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    )
  );

CREATE POLICY "Instrument creators and project owners can delete"
  ON instruments
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_instruments_updated_at
  BEFORE UPDATE ON instruments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_instruments_project_id ON instruments(project_id);
CREATE INDEX IF NOT EXISTS idx_instruments_created_by ON instruments(created_by);
CREATE INDEX IF NOT EXISTS idx_instruments_status ON instruments(status);
CREATE INDEX IF NOT EXISTS idx_instruments_type ON instruments(type);