-- Update demo tenant data to use 786 Cyber branding
UPDATE tenants 
SET 
  name = '786 Cyber Technologies',
  slug = '786-cyber-tech',
  domain = '786cyber.com'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Update demo asset hostnames to use 786cyber domain
UPDATE assets 
SET 
  hostname = CASE 
    WHEN hostname = 'dc01.secureops.local' THEN 'dc01.786cyber.local'
    WHEN hostname = 'web01.secureops.local' THEN 'web01.786cyber.local'
    WHEN hostname = 'db01.secureops.local' THEN 'db01.786cyber.local'
    ELSE hostname
  END
WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440001';