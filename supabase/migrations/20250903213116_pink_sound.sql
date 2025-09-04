/*
  # Create responses table

  1. New Tables
    - `responses`
      - `id` (uuid, primary key)
      - `collection_id` (uuid, references data_collections)
      - `participant_id` (text)
      - `answers` (jsonb, not null)
      - `metadata` (jsonb)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `completion_rate` (numeric)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `location` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `responses` table
    - Add policies for response access
*/

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES data_collections(id) ON DELETE CASCADE,
  participant_id text,
  answers jsonb NOT NULL DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  completion_rate numeric(5,2) DEFAULT 0.0,
  ip_address inet,
  user_agent text,
  location text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read responses from their projects"
  ON responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM data_collections dc
      JOIN instruments i ON dc.instrument_id = i.id
      JOIN projects p ON i.project_id = p.id
      WHERE dc.id = collection_id AND p.principal_investigator = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM data_collections dc
      JOIN instruments i ON dc.instrument_id = i.id
      JOIN project_collaborators pc ON i.project_id = pc.project_id
      WHERE dc.id = collection_id AND pc.user_id = auth.uid() AND pc.status = 'accepted'
    )
  );

CREATE POLICY "Anyone can insert responses to active collections"
  ON responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM data_collections 
      WHERE id = collection_id AND status = 'active'
    )
  );

-- Function to update collection stats when response is added
CREATE OR REPLACE FUNCTION update_collection_stats()
RETURNS trigger AS $$
BEGIN
  UPDATE data_collections 
  SET 
    responses_count = (
      SELECT COUNT(*) FROM responses WHERE collection_id = NEW.collection_id
    ),
    completion_rate = (
      SELECT AVG(completion_rate) FROM responses WHERE collection_id = NEW.collection_id
    ),
    updated_at = now()
  WHERE id = NEW.collection_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update collection stats
CREATE TRIGGER update_collection_stats_trigger
  AFTER INSERT ON responses
  FOR EACH ROW EXECUTE FUNCTION update_collection_stats();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_responses_collection_id ON responses(collection_id);
CREATE INDEX IF NOT EXISTS idx_responses_participant_id ON responses(participant_id);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);