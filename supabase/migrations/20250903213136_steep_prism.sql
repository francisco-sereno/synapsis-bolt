/*
  # Create files table

  1. New Tables
    - `files`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `name` (text, not null)
      - `original_name` (text, not null)
      - `type` (text, not null)
      - `mime_type` (text)
      - `size` (bigint, not null)
      - `storage_path` (text, not null)
      - `url` (text)
      - `tags` (text array)
      - `transcription` (text)
      - `extracted_text` (text)
      - `metadata` (jsonb)
      - `shared` (boolean)
      - `uploaded_by` (uuid, references profiles)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `files` table
    - Add policies for file access
*/

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  original_name text NOT NULL,
  type text NOT NULL,
  mime_type text,
  size bigint NOT NULL,
  storage_path text NOT NULL,
  url text,
  tags text[],
  transcription text,
  extracted_text text,
  metadata jsonb DEFAULT '{}',
  shared boolean DEFAULT false,
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read files from their projects"
  ON files
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = files.project_id AND user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "Project members can upload files"
  ON files
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = files.project_id AND user_id = auth.uid() 
      AND status = 'accepted'
    )
  );

CREATE POLICY "File uploaders and project owners can update"
  ON files
  FOR UPDATE
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    )
  );

CREATE POLICY "File uploaders and project owners can delete"
  ON files
  FOR DELETE
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND principal_investigator = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
CREATE INDEX IF NOT EXISTS idx_files_shared ON files(shared);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);