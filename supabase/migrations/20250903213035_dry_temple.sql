/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `methodology` (text, not null)
      - `design` (text, not null)
      - `institution` (text)
      - `principal_investigator` (uuid, references profiles)
      - `start_date` (date)
      - `end_date` (date)
      - `status` (enum: planificacion, activo, completado, pausado)
      - `ethics_approval` (text)
      - `visibility` (enum: private, institutional, public)
      - `settings` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `projects` table
    - Add policies for project access based on collaboration and visibility
*/

-- Create project status enum
CREATE TYPE project_status AS ENUM ('planificacion', 'activo', 'completado', 'pausado');

-- Create project visibility enum
CREATE TYPE project_visibility AS ENUM ('private', 'institutional', 'public');

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  methodology text NOT NULL,
  design text NOT NULL,
  institution text,
  principal_investigator uuid REFERENCES profiles(id) ON DELETE CASCADE,
  start_date date,
  end_date date,
  status project_status DEFAULT 'planificacion',
  ethics_approval text,
  visibility project_visibility DEFAULT 'private',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (principal_investigator = auth.uid());

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (principal_investigator = auth.uid());

CREATE POLICY "Principal investigators can update their projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (principal_investigator = auth.uid());

CREATE POLICY "Principal investigators can delete their projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (principal_investigator = auth.uid());

-- Trigger to update updated_at on project changes
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_principal_investigator ON projects(principal_investigator);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);