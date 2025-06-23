import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection function
export const testSupabaseConnection = async (): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    logger.info('✅ Connected to Supabase successfully');
  } catch (error) {
    logger.error('❌ Supabase connection error:', error);
    throw error;
  }
};

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          domain: string | null;
          subscription_tier: string;
          max_users: number;
          max_assets: number;
          settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          domain?: string | null;
          subscription_tier?: string;
          max_users?: number;
          max_assets?: number;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          domain?: string | null;
          subscription_tier?: string;
          max_users?: number;
          max_assets?: number;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      tenant_users: {
        Row: {
          id: string;
          tenant_id: string;
          auth_user_id: string;
          email: string;
          full_name: string;
          user_role: string;
          department: string | null;
          is_active: boolean;
          last_login_at: string | null;
          mfa_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          auth_user_id: string;
          email: string;
          full_name: string;
          user_role?: string;
          department?: string | null;
          is_active?: boolean;
          last_login_at?: string | null;
          mfa_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          auth_user_id?: string;
          email?: string;
          full_name?: string;
          user_role?: string;
          department?: string | null;
          is_active?: boolean;
          last_login_at?: string | null;
          mfa_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          tenant_id: string;
          asset_name: string;
          asset_type: string;
          category: string;
          ip_address: string | null;
          hostname: string | null;
          mac_address: string | null;
          operating_system: string | null;
          os_version: string | null;
          department: string | null;
          asset_owner: string | null;
          asset_location: string | null;
          criticality: string;
          asset_status: string;
          last_scan_at: string | null;
          vulnerability_count: number;
          compliance_frameworks: string[];
          asset_tags: string[];
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          asset_name: string;
          asset_type: string;
          category: string;
          ip_address?: string | null;
          hostname?: string | null;
          mac_address?: string | null;
          operating_system?: string | null;
          os_version?: string | null;
          department?: string | null;
          asset_owner?: string | null;
          asset_location?: string | null;
          criticality?: string;
          asset_status?: string;
          last_scan_at?: string | null;
          vulnerability_count?: number;
          compliance_frameworks?: string[];
          asset_tags?: string[];
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          asset_name?: string;
          asset_type?: string;
          category?: string;
          ip_address?: string | null;
          hostname?: string | null;
          mac_address?: string | null;
          operating_system?: string | null;
          os_version?: string | null;
          department?: string | null;
          asset_owner?: string | null;
          asset_location?: string | null;
          criticality?: string;
          asset_status?: string;
          last_scan_at?: string | null;
          vulnerability_count?: number;
          compliance_frameworks?: string[];
          asset_tags?: string[];
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      vulnerabilities: {
        Row: {
          id: string;
          tenant_id: string;
          cve_id: string | null;
          vuln_title: string;
          vuln_description: string;
          severity: string;
          cvss_score: number | null;
          vuln_category: string;
          published_date: string | null;
          discovered_date: string;
          vuln_status: string;
          exploit_available: boolean;
          solution: string | null;
          reference_links: string[];
          affected_assets: string[];
          assigned_to: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          cve_id?: string | null;
          vuln_title: string;
          vuln_description: string;
          severity: string;
          cvss_score?: number | null;
          vuln_category: string;
          published_date?: string | null;
          discovered_date?: string;
          vuln_status?: string;
          exploit_available?: boolean;
          solution?: string | null;
          reference_links?: string[];
          affected_assets?: string[];
          assigned_to?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          cve_id?: string | null;
          vuln_title?: string;
          vuln_description?: string;
          severity?: string;
          cvss_score?: number | null;
          vuln_category?: string;
          published_date?: string | null;
          discovered_date?: string;
          vuln_status?: string;
          exploit_available?: boolean;
          solution?: string | null;
          reference_links?: string[];
          affected_assets?: string[];
          assigned_to?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      security_alerts: {
        Row: {
          id: string;
          tenant_id: string;
          alert_type: string;
          severity: string;
          alert_title: string;
          alert_description: string;
          alert_source: string | null;
          alert_status: string;
          affected_assets: string[];
          indicators_of_compromise: string[];
          mitre_tactics: string[];
          mitre_techniques: string[];
          assigned_to: string | null;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          alert_type: string;
          severity: string;
          alert_title: string;
          alert_description: string;
          alert_source?: string | null;
          alert_status?: string;
          affected_assets?: string[];
          indicators_of_compromise?: string[];
          mitre_tactics?: string[];
          mitre_techniques?: string[];
          assigned_to?: string | null;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          alert_type?: string;
          severity?: string;
          alert_title?: string;
          alert_description?: string;
          alert_source?: string | null;
          alert_status?: string;
          affected_assets?: string[];
          indicators_of_compromise?: string[];
          mitre_tactics?: string[];
          mitre_techniques?: string[];
          assigned_to?: string | null;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}