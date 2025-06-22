import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.')
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Expected format: https://your-project-ref.supabase.co`)
}

// Validate anon key format (basic check)
if (supabaseAnonKey.includes('your-anon-key') || supabaseAnonKey.length < 100) {
  throw new Error('Invalid Supabase anon key. Please replace the placeholder with your actual anon key from Supabase project settings.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          subscription_tier: string
          max_users: number
          max_assets: number
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          subscription_tier?: string
          max_users?: number
          max_assets?: number
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          subscription_tier?: string
          max_users?: number
          max_assets?: number
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      tenant_users: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          role: 'super_admin' | 'tenant_admin' | 'security_manager' | 'analyst' | 'viewer'
          department: string | null
          is_active: boolean
          last_login: string | null
          mfa_enabled: boolean
          permissions: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tenant_id: string
          role?: 'super_admin' | 'tenant_admin' | 'security_manager' | 'analyst' | 'viewer'
          department?: string | null
          is_active?: boolean
          last_login?: string | null
          mfa_enabled?: boolean
          permissions?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tenant_id?: string
          role?: 'super_admin' | 'tenant_admin' | 'security_manager' | 'analyst' | 'viewer'
          department?: string | null
          is_active?: boolean
          last_login?: string | null
          mfa_enabled?: boolean
          permissions?: any
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          tenant_id: string
          name: string
          asset_type: string
          category: 'server' | 'workstation' | 'network_device' | 'mobile_device' | 'iot_device' | 'cloud_service'
          ip_address: string | null
          mac_address: string | null
          hostname: string | null
          operating_system: string | null
          version: string | null
          owner_id: string | null
          department: string | null
          location: string | null
          criticality: 'critical' | 'high' | 'medium' | 'low'
          status: string
          last_scan: string | null
          vulnerability_count: number
          compliance_status: any
          tags: string[]
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          asset_type: string
          category: 'server' | 'workstation' | 'network_device' | 'mobile_device' | 'iot_device' | 'cloud_service'
          ip_address?: string | null
          mac_address?: string | null
          hostname?: string | null
          operating_system?: string | null
          version?: string | null
          owner_id?: string | null
          department?: string | null
          location?: string | null
          criticality?: 'critical' | 'high' | 'medium' | 'low'
          status?: string
          last_scan?: string | null
          vulnerability_count?: number
          compliance_status?: any
          tags?: string[]
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          asset_type?: string
          category?: 'server' | 'workstation' | 'network_device' | 'mobile_device' | 'iot_device' | 'cloud_service'
          ip_address?: string | null
          mac_address?: string | null
          hostname?: string | null
          operating_system?: string | null
          version?: string | null
          owner_id?: string | null
          department?: string | null
          location?: string | null
          criticality?: 'critical' | 'high' | 'medium' | 'low'
          status?: string
          last_scan?: string | null
          vulnerability_count?: number
          compliance_status?: any
          tags?: string[]
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      vulnerabilities: {
        Row: {
          id: string
          tenant_id: string
          cve_id: string | null
          title: string
          description: string | null
          severity: 'critical' | 'high' | 'medium' | 'low'
          cvss_score: number | null
          affected_assets: string[]
          category: string | null
          published_date: string | null
          discovered_date: string
          status: string
          exploit_available: boolean
          solution: string | null
          references: string[]
          assigned_to: string | null
          due_date: string | null
          remediation_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          cve_id?: string | null
          title: string
          description?: string | null
          severity: 'critical' | 'high' | 'medium' | 'low'
          cvss_score?: number | null
          affected_assets?: string[]
          category?: string | null
          published_date?: string | null
          discovered_date?: string
          status?: string
          exploit_available?: boolean
          solution?: string | null
          references?: string[]
          assigned_to?: string | null
          due_date?: string | null
          remediation_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          cve_id?: string | null
          title?: string
          description?: string | null
          severity?: 'critical' | 'high' | 'medium' | 'low'
          cvss_score?: number | null
          affected_assets?: string[]
          category?: string | null
          published_date?: string | null
          discovered_date?: string
          status?: string
          exploit_available?: boolean
          solution?: string | null
          references?: string[]
          assigned_to?: string | null
          due_date?: string | null
          remediation_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      security_alerts: {
        Row: {
          id: string
          tenant_id: string
          alert_type: string
          severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title: string
          description: string | null
          source: string | null
          affected_assets: string[]
          indicators_of_compromise: string[]
          mitre_tactics: string[]
          status: string
          assigned_to: string | null
          acknowledged_at: string | null
          resolved_at: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          alert_type: string
          severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title: string
          description?: string | null
          source?: string | null
          affected_assets?: string[]
          indicators_of_compromise?: string[]
          mitre_tactics?: string[]
          status?: string
          assigned_to?: string | null
          acknowledged_at?: string | null
          resolved_at?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          alert_type?: string
          severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title?: string
          description?: string | null
          source?: string | null
          affected_assets?: string[]
          indicators_of_compromise?: string[]
          mitre_tactics?: string[]
          status?: string
          assigned_to?: string | null
          acknowledged_at?: string | null
          resolved_at?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      compliance_frameworks: {
        Row: {
          id: string
          tenant_id: string
          framework_name: string
          framework_version: string | null
          description: string | null
          requirements: any
          current_status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable'
          completion_percentage: number
          last_assessment: string | null
          next_assessment: string | null
          assigned_to: string | null
          evidence_documents: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          framework_name: string
          framework_version?: string | null
          description?: string | null
          requirements?: any
          current_status?: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable'
          completion_percentage?: number
          last_assessment?: string | null
          next_assessment?: string | null
          assigned_to?: string | null
          evidence_documents?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          framework_name?: string
          framework_version?: string | null
          description?: string | null
          requirements?: any
          current_status?: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable'
          completion_percentage?: number
          last_assessment?: string | null
          next_assessment?: string | null
          assigned_to?: string | null
          evidence_documents?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      incident_reports: {
        Row: {
          id: string
          tenant_id: string
          incident_number: string
          title: string
          description: string | null
          severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
          status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed'
          category: string | null
          affected_assets: string[]
          affected_users: string[]
          incident_commander: string | null
          team_members: string[]
          timeline: any
          containment_actions: string | null
          eradication_actions: string | null
          recovery_actions: string | null
          lessons_learned: string | null
          estimated_impact: string | null
          actual_impact: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          incident_number: string
          title: string
          description?: string | null
          severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
          status?: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed'
          category?: string | null
          affected_assets?: string[]
          affected_users?: string[]
          incident_commander?: string | null
          team_members?: string[]
          timeline?: any
          containment_actions?: string | null
          eradication_actions?: string | null
          recovery_actions?: string | null
          lessons_learned?: string | null
          estimated_impact?: string | null
          actual_impact?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string
          incident_number?: string
          title?: string
          description?: string | null
          severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
          status?: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed'
          category?: string | null
          affected_assets?: string[]
          affected_users?: string[]
          incident_commander?: string | null
          team_members?: string[]
          timeline?: any
          containment_actions?: string | null
          eradication_actions?: string | null
          recovery_actions?: string | null
          lessons_learned?: string | null
          estimated_impact?: string | null
          actual_impact?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          tenant_id: string
          user_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          old_values: any | null
          new_values: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          old_values?: any | null
          new_values?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          old_values?: any | null
          new_values?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_has_role: {
        Args: {
          required_role: 'super_admin' | 'tenant_admin' | 'security_manager' | 'analyst' | 'viewer'
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'super_admin' | 'tenant_admin' | 'security_manager' | 'analyst' | 'viewer'
      asset_category: 'server' | 'workstation' | 'network_device' | 'mobile_device' | 'iot_device' | 'cloud_service'
      asset_criticality: 'critical' | 'high' | 'medium' | 'low'
      vulnerability_severity: 'critical' | 'high' | 'medium' | 'low'
      alert_severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
      incident_status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed'
      compliance_status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}