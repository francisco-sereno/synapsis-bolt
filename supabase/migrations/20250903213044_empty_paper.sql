/*
  # Create project collaborators table

  1. New Tables
    - `project_collaborators`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references profiles)
      - `role` (enum: admin, editor, collaborator, viewer)
      - `permissions` (jsonb)
      - `invited_by` (uuid, references profiles)
      - `invited_at` (timestamptz)
      - `joined_at` (timestamptz)
      - `status` (enum: pending, accepted, declined)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `project_collaborators` table
    - Add policies for collaboration management
*/

-- Create collaborator role enum
CREATE TYPE collaborator_role AS ENUM ('admin', 'editor', 'collaborator', 'viewer');

-- Create collaboration status enum
CREATE TYPE collaboration_status AS ENUM ('pending', 'accepted', 'declined');

-- Create project_collaborators table
CREATE TABLE IF NOT EXISTS project_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role collaborator_role DEFAULT 'viewer',
  permissions jsonb DEFAULT '{}',
  invited_by uuid REFERENCES profiles(id),
  invited_at timestamptz DEFAULT now(),
  joined_at timestamptz,
  status collaboration_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read collaborations for their projects"
  ON project_collaborators
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage collaborators"
  ON project_collaborators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    )
  );

CREATE POLICY "Users can update their own collaboration status"
  ON project_collaborators
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_id ON project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_status ON project_collaborators(status);