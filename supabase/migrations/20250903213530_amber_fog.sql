/*
  # Fix profiles table RLS policies

  1. Security Changes
    - Remove recursive policy that causes infinite recursion
    - Simplify policies to use only auth.uid() checks
    - Remove admin check that queries profiles table from within profiles policies

  2. Policy Updates
    - Users can read their own profile: auth.uid() = id
    - Users can update their own profile: auth.uid() = id
    - Remove problematic admin policy that caused recursion
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);