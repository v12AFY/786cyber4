/*
  # Complete Multi-Tenant Cybersecurity Platform Database Schema

  1. New Tables
    - `tenants` - Organization/tenant management
    - `tenant_users` - User management with tenant context
    - `assets` - IT infrastructure and asset tracking
    - `vulnerabilities` - CVE and vulnerability management
    - `security_alerts` - Real-time threat detection
    - `compliance_frameworks` - Compliance tracking (NIST, ISO, GDPR, etc.)
    - `incident_reports` - Security incident management
    - `audit_logs` - Complete audit trail

  2. Security Features
    - Row Level Security (RLS) for complete tenant isolation
    - Role-based access control with 5 permission levels
    - Automatic audit logging for all changes
    - Secure helper functions for tenant context

  3. Performance Optimizations
    - Strategic indexes for all major queries
    - Automatic timestamp management
    - Efficient tenant-based data partitioning
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE user_role AS ENUM ('super_admin', 'tenant_admin', 'security_manager', 'analyst', 'viewer');
CREATE TYPE asset_criticality AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE asset_status AS ENUM ('online', 'offline', 'maintenance', 'unknown');
CREATE TYPE vulnerability_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE vulnerability_status AS ENUM ('open', 'in_progress', 'resolved', 'accepted_risk');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_status AS ENUM ('open', 'investigating', 'contained', 'resolved');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'contained', 'resolved', 'closed');
CREATE TYPE compliance_status AS ENUM ('not_started', 'in_progress', 'compliant', 'non_compliant');

-- Tenants table (Organizations)
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  domain text,
  subscription_tier subscription_tier DEFAULT 'starter',
  max_users integer DEFAULT 25,
  max_assets integer DEFAULT 250,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tenant Users table (extends auth.users with tenant context)
CREATE TABLE IF NOT EXISTS tenant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  user_role user_role DEFAULT 'viewer',
  department text,
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  mfa_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, email),
  UNIQUE(auth_user_id)
);

-- Assets table (IT Infrastructure)
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  asset_name text NOT NULL,
  asset_type text NOT NULL,
  category text NOT NULL,
  ip_address inet,
  hostname text,
  mac_address macaddr,
  operating_system text,
  os_version text,
  department text,
  asset_owner text,
  asset_location text,
  criticality asset_criticality DEFAULT 'medium',
  asset_status asset_status DEFAULT 'unknown',
  last_scan_at timestamptz,
  vulnerability_count integer DEFAULT 0,
  compliance_frameworks text[] DEFAULT '{}',
  asset_tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vulnerabilities table (CVE tracking)
CREATE TABLE IF NOT EXISTS vulnerabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  cve_id text,
  vuln_title text NOT NULL,
  vuln_description text NOT NULL,
  severity vulnerability_severity NOT NULL,
  cvss_score decimal(3,1),
  vuln_category text NOT NULL,
  published_date date,
  discovered_date date DEFAULT CURRENT_DATE,
  vuln_status vulnerability_status DEFAULT 'open',
  exploit_available boolean DEFAULT false,
  solution text,
  reference_links text[] DEFAULT '{}',
  affected_assets uuid[] DEFAULT '{}',
  assigned_to uuid REFERENCES tenant_users(id),
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Security Alerts table (Real-time threats)
CREATE TABLE IF NOT EXISTS security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  severity alert_severity NOT NULL,
  alert_title text NOT NULL,
  alert_description text NOT NULL,
  alert_source text,
  alert_status alert_status DEFAULT 'open',
  affected_assets uuid[] DEFAULT '{}',
  indicators_of_compromise text[] DEFAULT '{}',
  mitre_tactics text[] DEFAULT '{}',
  mitre_techniques text[] DEFAULT '{}',
  assigned_to uuid REFERENCES tenant_users(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Compliance Frameworks table
CREATE TABLE IF NOT EXISTS compliance_frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  framework_name text NOT NULL,
  framework_version text,
  framework_description text,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  current_status compliance_status DEFAULT 'not_started',
  requirements_total integer DEFAULT 0,
  requirements_completed integer DEFAULT 0,
  last_assessment_date date,
  next_assessment_date date,
  assigned_to uuid REFERENCES tenant_users(id),
  evidence_documents text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Incident Reports table
CREATE TABLE IF NOT EXISTS incident_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  incident_number text NOT NULL,
  incident_title text NOT NULL,
  incident_description text NOT NULL,
  severity incident_severity NOT NULL,
  incident_status incident_status DEFAULT 'open',
  incident_category text NOT NULL,
  affected_assets uuid[] DEFAULT '{}',
  affected_users uuid[] DEFAULT '{}',
  assigned_to uuid REFERENCES tenant_users(id),
  response_team uuid[] DEFAULT '{}',
  incident_timeline jsonb DEFAULT '[]',
  lessons_learned text,
  estimated_impact text,
  actual_impact text,
  containment_actions text[] DEFAULT '{}',
  recovery_actions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Audit Logs table (Complete audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES tenant_users(id),
  audit_action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_auth_user_id ON tenant_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_assets_tenant_id ON assets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_assets_criticality ON assets(criticality);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(asset_status);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_tenant_id ON vulnerabilities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_status ON vulnerabilities(vuln_status);
CREATE INDEX IF NOT EXISTS idx_security_alerts_tenant_id ON security_alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON security_alerts(alert_status);
CREATE INDEX IF NOT EXISTS idx_compliance_frameworks_tenant_id ON compliance_frameworks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_tenant_id ON incident_reports(tenant_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON incident_reports(incident_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current tenant ID
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM tenant_users 
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has role
CREATE OR REPLACE FUNCTION user_has_role(required_role user_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM tenant_users 
    WHERE auth_user_id = auth.uid() 
    AND user_role >= required_role
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for tenant isolation

-- Tenants policies
CREATE POLICY "Users can view their own tenant" ON tenants
  FOR SELECT USING (
    id = get_current_tenant_id()
  );

CREATE POLICY "Tenant admins can update their tenant" ON tenants
  FOR UPDATE USING (
    id = get_current_tenant_id() AND user_has_role('tenant_admin')
  );

-- Tenant Users policies
CREATE POLICY "Users can view users in their tenant" ON tenant_users
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant admins can manage users in their tenant" ON tenant_users
  FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('tenant_admin')
  );

CREATE POLICY "Users can update their own profile" ON tenant_users
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Assets policies
CREATE POLICY "Users can view assets in their tenant" ON assets
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Security managers can manage assets" ON assets
  FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('security_manager')
  );

-- Vulnerabilities policies
CREATE POLICY "Users can view vulnerabilities in their tenant" ON vulnerabilities
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Analysts can manage vulnerabilities" ON vulnerabilities
  FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('analyst')
  );

-- Security Alerts policies
CREATE POLICY "Users can view alerts in their tenant" ON security_alerts
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Analysts can manage alerts" ON security_alerts
  FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('analyst')
  );

-- Compliance Frameworks policies
CREATE POLICY "Users can view compliance in their tenant" ON compliance_frameworks
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Security managers can manage compliance" ON compliance_frameworks
  FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('security_manager')
  );

-- Incident Reports policies
CREATE POLICY "Users can view incidents in their tenant" ON incident_reports
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Analysts can manage incidents" ON incident_reports
  FOR ALL USING (
    tenant_id = get_current_tenant_id() AND user_has_role('analyst')
  );

-- Audit Logs policies
CREATE POLICY "Users can view audit logs in their tenant" ON audit_logs
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Tenant admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() AND user_has_role('tenant_admin')
  );

-- Smart audit log function that handles different table structures
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS trigger AS $$
DECLARE
  tenant_id_value uuid;
  resource_id_value uuid;
BEGIN
  -- Determine tenant_id based on table structure
  IF TG_TABLE_NAME = 'tenants' THEN
    tenant_id_value := COALESCE(NEW.id, OLD.id);
  ELSE
    tenant_id_value := COALESCE(NEW.tenant_id, OLD.tenant_id);
  END IF;
  
  -- Determine resource_id
  resource_id_value := COALESCE(NEW.id, OLD.id);
  
  -- Insert audit log entry
  INSERT INTO audit_logs (
    tenant_id,
    user_id,
    audit_action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    tenant_id_value,
    (SELECT id FROM tenant_users WHERE auth_user_id = auth.uid() LIMIT 1),
    TG_OP,
    TG_TABLE_NAME,
    resource_id_value,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers
CREATE TRIGGER audit_tenants AFTER INSERT OR UPDATE OR DELETE ON tenants
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_tenant_users AFTER INSERT OR UPDATE OR DELETE ON tenant_users
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_assets AFTER INSERT OR UPDATE OR DELETE ON assets
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_vulnerabilities AFTER INSERT OR UPDATE OR DELETE ON vulnerabilities
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_security_alerts AFTER INSERT OR UPDATE OR DELETE ON security_alerts
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_compliance_frameworks AFTER INSERT OR UPDATE OR DELETE ON compliance_frameworks
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_incident_reports AFTER INSERT OR UPDATE OR DELETE ON incident_reports
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_users_updated_at BEFORE UPDATE ON tenant_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vulnerabilities_updated_at BEFORE UPDATE ON vulnerabilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_alerts_updated_at BEFORE UPDATE ON security_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_frameworks_updated_at BEFORE UPDATE ON compliance_frameworks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON incident_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo tenants
INSERT INTO tenants (id, name, slug, domain, subscription_tier, max_users, max_assets) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'SecureOps Technologies', 'secureops-tech', 'secureops.com', 'enterprise', 100, 1000),
  ('550e8400-e29b-41d4-a716-446655440002', 'FinanceGuard Corp', 'financeguard', 'financeguard.com', 'professional', 50, 500),
  ('550e8400-e29b-41d4-a716-446655440003', 'HealthSecure Inc', 'healthsecure', 'healthsecure.com', 'starter', 25, 250);

-- Insert demo compliance frameworks
INSERT INTO compliance_frameworks (tenant_id, framework_name, framework_version, framework_description, completion_percentage, current_status, requirements_total, requirements_completed) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'NIST Cybersecurity Framework', '1.1', 'Comprehensive framework for managing cybersecurity risk', 87, 'in_progress', 23, 20),
  ('550e8400-e29b-41d4-a716-446655440001', 'ISO 27001', '2013', 'International standard for information security management', 72, 'in_progress', 35, 25),
  ('550e8400-e29b-41d4-a716-446655440001', 'GDPR', '2018', 'European data protection regulation', 94, 'compliant', 18, 17),
  ('550e8400-e29b-41d4-a716-446655440001', 'PCI-DSS', '4.0', 'Payment card industry data security standard', 65, 'in_progress', 12, 8);

-- Insert demo assets
INSERT INTO assets (tenant_id, asset_name, asset_type, category, ip_address, hostname, operating_system, department, criticality, asset_status, vulnerability_count) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'DC-Server-01', 'Domain Controller', 'server', '192.168.1.10', 'dc01.secureops.local', 'Windows Server 2022', 'IT', 'critical', 'online', 3),
  ('550e8400-e29b-41d4-a716-446655440001', 'Web-Server-01', 'Web Server', 'server', '192.168.1.20', 'web01.secureops.local', 'Ubuntu 22.04', 'IT', 'high', 'online', 1),
  ('550e8400-e29b-41d4-a716-446655440001', 'DB-Server-01', 'Database Server', 'server', '192.168.1.30', 'db01.secureops.local', 'CentOS 8', 'IT', 'critical', 'online', 2),
  ('550e8400-e29b-41d4-a716-446655440001', 'Finance-WS-05', 'Workstation', 'workstation', '192.168.2.45', 'fin-ws-05', 'Windows 11', 'Finance', 'medium', 'online', 1),
  ('550e8400-e29b-41d4-a716-446655440001', 'HR-WS-12', 'Workstation', 'workstation', '192.168.2.67', 'hr-ws-12', 'Windows 11', 'HR', 'medium', 'online', 0);

-- Insert demo vulnerabilities
INSERT INTO vulnerabilities (tenant_id, cve_id, vuln_title, vuln_description, severity, cvss_score, vuln_category, vuln_status, exploit_available, solution) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'CVE-2024-0001', 'Windows RCE Vulnerability', 'Remote code execution in Windows Print Spooler service', 'critical', 9.8, 'Operating System', 'open', true, 'Apply Windows Security Update KB5034441'),
  ('550e8400-e29b-41d4-a716-446655440001', 'CVE-2023-9876', 'Apache HTTP Server Buffer Overflow', 'Buffer overflow vulnerability in Apache HTTP Server', 'high', 8.1, 'Web Application', 'in_progress', false, 'Upgrade to Apache HTTP Server 2.4.58'),
  ('550e8400-e29b-41d4-a716-446655440001', 'CVE-2023-5432', 'MySQL Privilege Escalation', 'Local privilege escalation in MySQL Server', 'medium', 6.7, 'Database', 'resolved', false, 'Update to MySQL 8.0.35');

-- Insert demo security alerts
INSERT INTO security_alerts (tenant_id, alert_type, severity, alert_title, alert_description, alert_source, alert_status, indicators_of_compromise, mitre_tactics) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Malware Detection', 'high', 'Suspicious PowerShell Activity', 'Encoded PowerShell command detected on Finance workstation', 'EDR', 'open', ARRAY['powershell.exe', 'base64 encoded command'], ARRAY['Execution']),
  ('550e8400-e29b-41d4-a716-446655440001', 'Intrusion Attempt', 'medium', 'Brute Force Login Attempt', 'Multiple failed login attempts from suspicious IP', 'Firewall', 'investigating', ARRAY['185.220.101.45', 'admin username'], ARRAY['Credential Access']),
  ('550e8400-e29b-41d4-a716-446655440001', 'Data Exfiltration', 'high', 'DNS Exfiltration Detected', 'Unusual DNS queries suggesting data exfiltration', 'Network Monitor', 'contained', ARRAY['malicious.evil-domain.com', 'DNS tunneling'], ARRAY['Exfiltration']);

-- Insert demo incident reports
INSERT INTO incident_reports (tenant_id, incident_number, incident_title, incident_description, severity, incident_status, incident_category) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'INC-2024-001', 'Ransomware Attack Detected', 'Suspicious file encryption activity detected on multiple workstations', 'critical', 'investigating', 'Malware'),
  ('550e8400-e29b-41d4-a716-446655440001', 'INC-2024-002', 'Data Breach Investigation', 'Unauthorized access to customer database detected', 'high', 'contained', 'Data Breach'),
  ('550e8400-e29b-41d4-a716-446655440001', 'INC-2024-003', 'DDoS Attack Mitigation', 'Large scale DDoS attack targeting web services', 'medium', 'resolved', 'Network Attack');