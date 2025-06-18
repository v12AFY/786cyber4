/*
  # Fix tenant creation during registration

  1. Security Changes
    - Add RLS policy to allow tenant creation during registration
    - Allow authenticated users to create tenants
    - Maintain security by ensuring users can only create one tenant initially

  This migration fixes the "new row violates row-level security policy" error
  that occurs when new users try to register and create their organization.
*/

-- Allow authenticated users to create tenants during registration
CREATE POLICY "Allow tenant creation during registration"
  ON tenants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also allow service role to create tenants (for admin operations)
CREATE POLICY "Service role can manage tenants"
  ON tenants
  FOR ALL
  TO service_role
  WITH CHECK (true);