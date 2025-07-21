/*
  # Fix tenant_users RLS policy for signup

  1. Changes
    - Add RLS policy to allow users to read their own tenant_users record
    - This prevents circular dependency during signup process

  2. Security
    - Allows authenticated users to SELECT their own records based on auth_user_id
    - Maintains tenant isolation while fixing signup flow
*/

-- Add policy to allow users to read their own tenant_users record
-- This prevents circular dependency issues during signup
CREATE POLICY "Users can read their own tenant_users record" ON tenant_users
  FOR SELECT USING (auth_user_id = auth.uid());