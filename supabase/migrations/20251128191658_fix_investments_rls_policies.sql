/*
  # Fix RLS policies for investments table

  1. Security Updates
    - Drop existing restrictive policies
    - Create new comprehensive policies that explicitly allow all operations
    - Ensure auth.uid() = user_id checks on all policies
    - Use proper USING and WITH CHECK clauses
*/

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can read own investments" ON investments;
  DROP POLICY IF EXISTS "Users can insert own investments" ON investments;
  DROP POLICY IF EXISTS "Users can update own investments" ON investments;
  DROP POLICY IF EXISTS "Users can delete own investments" ON investments;
END $$;

CREATE POLICY "investments_select_policy"
  ON investments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "investments_insert_policy"
  ON investments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "investments_update_policy"
  ON investments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "investments_delete_policy"
  ON investments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
