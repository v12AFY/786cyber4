/*
  # Allow authenticated users to create their own tenant_user record

  1. Security Changes
    - Add RLS policy to allow authenticated users to insert their own record into tenant_users table
    - This fixes the "Database error saving new user" issue during registration
    - Policy ensures users can only create records where auth_user_id matches their session

  This migration resolves the registration error where new users cannot create their 
  initial tenant_users record due to overly restrictive RLS policies.
*/

-- Allow authenticated users to create their own tenant_user record
CREATE POLICY "Allow authenticated user to create their own tenant_user record" 
  ON tenant_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());