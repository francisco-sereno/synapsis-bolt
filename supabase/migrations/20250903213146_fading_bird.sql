/*
  # Create additional tables for research platform

  1. New Tables
    - `triangulations` - For data triangulation results
    - `reports` - For generated reports
    - `notifications` - For user notifications
    - `ai_requests` - For AI service usage tracking
    - `collaboration_activity` - For activity logging
    - `search_queries` - For search history
    - `recommendations` - For AI recommendations

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create triangulations table
CREATE TABLE IF NOT EXISTS triangulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  method text NOT NULL,
  sources jsonb DEFAULT '[]',
  results jsonb DEFAULT '{}',
  convergences jsonb DEFAULT '[]',
  divergences jsonb DEFAULT '[]',
  meta_inferences text[],
  confidence_score numeric(3,2),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL,
  template text NOT NULL,
  content jsonb DEFAULT '{}',
  sections jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  status text DEFAULT 'draft',
  download_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  action_url text,
  action_label text,
  created_at timestamptz DEFAULT now()
);

-- Create ai_requests table
CREATE TABLE IF NOT EXISTS ai_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,
  input_data jsonb NOT NULL,
  output_data jsonb,
  processing_time integer,
  tokens_used integer,
  cost numeric(10,4),
  status text DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create collaboration_activity table
CREATE TABLE IF NOT EXISTS collaboration_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_type text,
  target_id text,
  target_name text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create search_queries table
CREATE TABLE IF NOT EXISTS search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  query text NOT NULL,
  filters jsonb DEFAULT '{}',
  results_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,
  priority text DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL,
  action text NOT NULL,
  impact text,
  effort text,
  module text,
  dismissed boolean DEFAULT false,
  dismissed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE triangulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Triangulations policies
CREATE POLICY "Users can read triangulations from their projects"
  ON triangulations FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND principal_investigator = auth.uid()) OR
    EXISTS (SELECT 1 FROM project_collaborators WHERE project_id = triangulations.project_id AND user_id = auth.uid() AND status = 'accepted')
  );

CREATE POLICY "Project members can create triangulations"
  ON triangulations FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND principal_investigator = auth.uid()) OR
    EXISTS (SELECT 1 FROM project_collaborators WHERE project_id = triangulations.project_id AND user_id = auth.uid() AND status = 'accepted' AND role IN ('admin', 'editor'))
  );

-- Reports policies
CREATE POLICY "Users can read reports from their projects"
  ON reports FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND principal_investigator = auth.uid()) OR
    EXISTS (SELECT 1 FROM project_collaborators WHERE project_id = reports.project_id AND user_id = auth.uid() AND status = 'accepted')
  );

CREATE POLICY "Project members can create reports"
  ON reports FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND principal_investigator = auth.uid()) OR
    EXISTS (SELECT 1 FROM project_collaborators WHERE project_id = reports.project_id AND user_id = auth.uid() AND status = 'accepted')
  );

-- Notifications policies
CREATE POLICY "Users can read their own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- AI requests policies
CREATE POLICY "Users can read their own AI requests"
  ON ai_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create AI requests"
  ON ai_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Activity policies
CREATE POLICY "Users can read activity from their projects"
  ON collaboration_activity FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND principal_investigator = auth.uid()) OR
    EXISTS (SELECT 1 FROM project_collaborators WHERE project_id = collaboration_activity.project_id AND user_id = auth.uid() AND status = 'accepted')
  );

-- Search queries policies
CREATE POLICY "Users can read their own search queries"
  ON search_queries FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create search queries"
  ON search_queries FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Recommendations policies
CREATE POLICY "Users can read their own recommendations"
  ON recommendations FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own recommendations"
  ON recommendations FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_triangulations_updated_at
  BEFORE UPDATE ON triangulations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_triangulations_project_id ON triangulations(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_ai_requests_user_id ON ai_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_requests_project_id ON ai_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_activity_project_id ON collaboration_activity(project_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_user_id ON search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_dismissed ON recommendations(dismissed);