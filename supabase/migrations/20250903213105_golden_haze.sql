/*
  # Create data collections table

  1. New Tables
    - `data_collections`
      - `id` (uuid, primary key)
      - `instrument_id` (uuid, references instruments)
      - `name` (text, not null)
      - `description` (text)
      - `status` (enum: active, paused, completed, cancelled)
      - `target_responses` (integer)
      - `responses_count` (integer)
      - `completion_rate` (numeric)
      - `settings` (jsonb)
      - `analytics` (jsonb)
      - `url_slug` (text, unique)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `data_collections` table
    - Add policies for collection access
*/

-- Create collection status enum
CREATE TYPE collection_status AS ENUM ('active', 'paused', 'completed', 'cancelled');

-- Create data_collections table
CREATE TABLE IF NOT EXISTS data_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id uuid REFERENCES instruments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status collection_status DEFAULT 'active',
  target_responses integer,
  responses_count integer DEFAULT 0,
  completion_rate numeric(5,2) DEFAULT 0.0,
  settings jsonb DEFAULT '{}',
  analytics jsonb DEFAULT '{}',
  url_slug text UNIQUE,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE data_collections ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read collections from their projects"
  ON data_collections
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM instruments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.id = instrument_id AND p.principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM instruments i
      JOIN project_collaborators pc ON i.project_id = pc.project_id
      WHERE i.id = instrument_id AND pc.user_id = auth.uid() AND pc.status = 'accepted'
    )
  );

CREATE POLICY "Project members can create collections"
  ON data_collections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM instruments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.id = instrument_id AND p.principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM instruments i
      JOIN project_collaborators pc ON i.project_id = pc.project_id
      WHERE i.id = instrument_id AND pc.user_id = auth.uid() 
      AND pc.status = 'accepted' AND pc.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Collection creators can update"
  ON data_collections
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Trigger to update updated_at
CREATE TRIGGER update_data_collections_updated_at
  BEFORE UPDATE ON data_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_data_collections_instrument_id ON data_collections(instrument_id);
CREATE INDEX IF NOT EXISTS idx_data_collections_status ON data_collections(status);
CREATE INDEX IF NOT EXISTS idx_data_collections_url_slug ON data_collections(url_slug);