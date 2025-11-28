/*
  # Create investments table for ROI Validator

  1. New Tables
    - `investments`
      - `id` (uuid, primary key) - Unique identifier for each investment
      - `created_at` (timestamptz) - Timestamp when the investment was created
      - `project_name` (text) - Name of the business project/idea
      - `cost` (numeric) - Investment cost amount
      - `revenue` (numeric) - Expected revenue amount
      - `user_id` (uuid) - Foreign key to auth.users, owner of the investment

  2. Security
    - Enable RLS on `investments` table
    - Add policy for authenticated users to read their own investments
    - Add policy for authenticated users to insert their own investments
    - Add policy for authenticated users to update their own investments
    - Add policy for authenticated users to delete their own investments

  3. Important Notes
    - All users can only access their own investment data
    - The ROI calculation is done on the frontend: ROI = ((revenue - cost) / cost) * 100
    - RLS ensures complete data isolation between users
*/

CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  project_name text NOT NULL,
  cost numeric NOT NULL CHECK (cost >= 0),
  revenue numeric NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own investments"
  ON investments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments"
  ON investments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments"
  ON investments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments"
  ON investments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS investments_user_id_idx ON investments(user_id);
CREATE INDEX IF NOT EXISTS investments_created_at_idx ON investments(created_at DESC);
