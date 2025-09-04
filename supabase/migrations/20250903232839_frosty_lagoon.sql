/*
  # Create templates table

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `type` (enum: survey, interview, observation, scale, test)
      - `questions` (jsonb)
      - `metadata` (jsonb)
      - `usage_count` (integer)
      - `is_public` (boolean)
      - `created_by` (uuid, foreign key to profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `templates` table
    - Add policies for public templates and user-created templates
*/

-- Create template type enum
CREATE TYPE template_type AS ENUM ('survey', 'interview', 'observation', 'scale', 'test');

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  type template_type NOT NULL DEFAULT 'survey',
  questions jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  usage_count integer DEFAULT 0,
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public templates are readable by everyone"
  ON templates
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can read their own templates"
  ON templates
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create templates"
  ON templates
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates"
  ON templates
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates"
  ON templates
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create indexes
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_public ON templates(is_public);
CREATE INDEX idx_templates_created_by ON templates(created_by);

-- Create trigger for updated_at
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample public templates
INSERT INTO templates (name, description, category, type, questions, metadata, is_public, created_by) VALUES
(
  'Evaluación Docente HyFlex',
  'Plantilla especializada para evaluar modalidades híbridas de enseñanza',
  'Educación',
  'survey',
  '[
    {
      "id": "1",
      "text": "¿Cuál es su nivel de satisfacción con la modalidad híbrida?",
      "type": "likert",
      "required": true,
      "scale": {"min": 1, "max": 5, "minLabel": "Muy insatisfecho", "maxLabel": "Muy satisfecho"}
    },
    {
      "id": "2", 
      "text": "¿Qué aspectos de la modalidad híbrida considera más efectivos?",
      "type": "multiple_select",
      "required": true,
      "options": ["Flexibilidad horaria", "Interacción presencial", "Recursos digitales", "Evaluación continua"]
    }
  ]'::jsonb,
  '{"estimatedTime": 15, "language": "es", "version": "1.0"}'::jsonb,
  true,
  (SELECT id FROM profiles WHERE email = 'francisco.sereno.a@gmail.com' LIMIT 1)
),
(
  'Satisfacción del Cliente',
  'Instrumento estándar para medir satisfacción y lealtad del cliente',
  'Comercial',
  'survey',
  '[
    {
      "id": "1",
      "text": "¿Cómo calificaría su experiencia general con nuestro servicio?",
      "type": "likert",
      "required": true,
      "scale": {"min": 1, "max": 5, "minLabel": "Muy mala", "maxLabel": "Excelente"}
    },
    {
      "id": "2",
      "text": "¿Recomendaría nuestros servicios a otros?",
      "type": "yes_no",
      "required": true
    }
  ]'::jsonb,
  '{"estimatedTime": 10, "language": "es", "version": "1.0"}'::jsonb,
  true,
  (SELECT id FROM profiles WHERE email = 'francisco.sereno.a@gmail.com' LIMIT 1)
),
(
  'Evaluación de Usabilidad UX',
  'Cuestionario para evaluar experiencia de usuario en interfaces digitales',
  'Tecnología',
  'survey',
  '[
    {
      "id": "1",
      "text": "¿Qué tan fácil fue completar las tareas principales?",
      "type": "likert",
      "required": true,
      "scale": {"min": 1, "max": 5, "minLabel": "Muy difícil", "maxLabel": "Muy fácil"}
    },
    {
      "id": "2",
      "text": "¿Qué aspectos de la interfaz mejoraría?",
      "type": "text_long",
      "required": false
    }
  ]'::jsonb,
  '{"estimatedTime": 12, "language": "es", "version": "1.0"}'::jsonb,
  true,
  (SELECT id FROM profiles WHERE email = 'francisco.sereno.a@gmail.com' LIMIT 1)
);