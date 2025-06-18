import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']

// Tenant Management
export const tenantService = {
  async getCurrentTenant() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tenant_users')
      .select(`
        tenant_id,
        role,
        tenants (
          id,
          name,
          slug,
          domain,
          subscription_tier,
          max_users,
          max_assets,
          settings
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },

  async createTenant(tenantData: Tables['tenants']['Insert']) {
    const { data, error } = await supabase
      .from('tenants')
      .insert(tenantData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTenant(id: string, updates: Tables['tenants']['Update']) {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// User Management
export const userService = {
  async getTenantUsers() {
    const { data, error } = await supabase
      .from('tenant_users')
      .select(`
        *,
        auth_users:user_id (
          email,
          created_at,
          last_sign_in_at
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createTenantUser(userData: Tables['tenant_users']['Insert']) {
    const { data, error } = await supabase
      .from('tenant_users')
      .insert(userData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTenantUser(id: string, updates: Tables['tenant_users']['Update']) {
    const { data, error } = await supabase
      .from('tenant_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deactivateUser(id: string) {
    const { data, error } = await supabase
      .from('tenant_users')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Asset Management
export const assetService = {
  async getAssets(filters: {
    category?: string
    criticality?: string
    status?: string
    search?: string
  } = {}) {
    let query = supabase
      .from('assets')
      .select(`
        *,
        owner:owner_id (
          id,
          auth_users:user_id (email)
        )
      `)
      .order('created_at', { ascending: false })

    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.criticality) {
      query = query.eq('criticality', filters.criticality)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,hostname.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createAsset(assetData: Tables['assets']['Insert']) {
    const { data, error } = await supabase
      .from('assets')
      .insert(assetData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateAsset(id: string, updates: Tables['assets']['Update']) {
    const { data, error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteAsset(id: string) {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getAssetStats() {
    const { data, error } = await supabase
      .from('assets')
      .select('criticality, status, vulnerability_count')

    if (error) throw error

    const stats = {
      total: data.length,
      critical: data.filter(a => a.criticality === 'critical').length,
      high: data.filter(a => a.criticality === 'high').length,
      online: data.filter(a => a.status === 'online').length,
      offline: data.filter(a => a.status === 'offline').length,
      totalVulnerabilities: data.reduce((sum, a) => sum + (a.vulnerability_count || 0), 0)
    }

    return stats
  }
}

// Vulnerability Management
export const vulnerabilityService = {
  async getVulnerabilities(filters: {
    severity?: string
    status?: string
    category?: string
  } = {}) {
    let query = supabase
      .from('vulnerabilities')
      .select(`
        *,
        assigned_user:assigned_to (
          id,
          auth_users:user_id (email)
        )
      `)
      .order('created_at', { ascending: false })

    if (filters.severity) {
      query = query.eq('severity', filters.severity)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createVulnerability(vulnData: Tables['vulnerabilities']['Insert']) {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .insert(vulnData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateVulnerability(id: string, updates: Tables['vulnerabilities']['Update']) {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getVulnerabilityStats() {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .select('severity, status')

    if (error) throw error

    const stats = {
      total: data.length,
      critical: data.filter(v => v.severity === 'critical').length,
      high: data.filter(v => v.severity === 'high').length,
      medium: data.filter(v => v.severity === 'medium').length,
      low: data.filter(v => v.severity === 'low').length,
      open: data.filter(v => v.status === 'open').length,
      inProgress: data.filter(v => v.status === 'in_progress').length,
      resolved: data.filter(v => v.status === 'resolved').length
    }

    return stats
  }
}

// Security Alerts
export const alertService = {
  async getSecurityAlerts(filters: {
    severity?: string
    status?: string
    alert_type?: string
  } = {}) {
    let query = supabase
      .from('security_alerts')
      .select(`
        *,
        assigned_user:assigned_to (
          id,
          auth_users:user_id (email)
        )
      `)
      .order('created_at', { ascending: false })

    if (filters.severity) {
      query = query.eq('severity', filters.severity)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.alert_type) {
      query = query.eq('alert_type', filters.alert_type)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createSecurityAlert(alertData: Tables['security_alerts']['Insert']) {
    const { data, error } = await supabase
      .from('security_alerts')
      .insert(alertData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSecurityAlert(id: string, updates: Tables['security_alerts']['Update']) {
    const { data, error } = await supabase
      .from('security_alerts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async acknowledgeAlert(id: string) {
    const { data, error } = await supabase
      .from('security_alerts')
      .update({ 
        status: 'acknowledged',
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Compliance Management
export const complianceService = {
  async getComplianceFrameworks() {
    const { data, error } = await supabase
      .from('compliance_frameworks')
      .select(`
        *,
        assigned_user:assigned_to (
          id,
          auth_users:user_id (email)
        )
      `)
      .order('framework_name')

    if (error) throw error
    return data
  },

  async createComplianceFramework(frameworkData: Tables['compliance_frameworks']['Insert']) {
    const { data, error } = await supabase
      .from('compliance_frameworks')
      .insert(frameworkData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateComplianceFramework(id: string, updates: Tables['compliance_frameworks']['Update']) {
    const { data, error } = await supabase
      .from('compliance_frameworks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Incident Management
export const incidentService = {
  async getIncidents(filters: {
    severity?: string
    status?: string
    category?: string
  } = {}) {
    let query = supabase
      .from('incident_reports')
      .select(`
        *,
        commander:incident_commander (
          id,
          auth_users:user_id (email)
        )
      `)
      .order('created_at', { ascending: false })

    if (filters.severity) {
      query = query.eq('severity', filters.severity)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createIncident(incidentData: Tables['incident_reports']['Insert']) {
    const { data, error } = await supabase
      .from('incident_reports')
      .insert(incidentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateIncident(id: string, updates: Tables['incident_reports']['Update']) {
    const { data, error } = await supabase
      .from('incident_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Audit Logs
export const auditService = {
  async getAuditLogs(filters: {
    action?: string
    resource_type?: string
    user_id?: string
    limit?: number
  } = {}) {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:user_id (
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (filters.action) {
      query = query.eq('action', filters.action)
    }
    if (filters.resource_type) {
      query = query.eq('resource_type', filters.resource_type)
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }
}

// Dashboard Analytics
export const analyticsService = {
  async getDashboardMetrics() {
    const [
      assetStats,
      vulnStats,
      alertsData,
      complianceData
    ] = await Promise.all([
      assetService.getAssetStats(),
      vulnerabilityService.getVulnerabilityStats(),
      alertService.getSecurityAlerts({ status: 'open' }),
      complianceService.getComplianceFrameworks()
    ])

    const securityScore = Math.max(0, 100 - (vulnStats.critical * 10) - (vulnStats.high * 5) - (alertsData.length * 2))
    const complianceScore = complianceData.length > 0 
      ? Math.round(complianceData.reduce((sum, f) => sum + f.completion_percentage, 0) / complianceData.length)
      : 0

    return {
      securityScore,
      activeThreats: alertsData.length,
      complianceStatus: complianceScore,
      assetsProtected: assetStats.total,
      criticalVulnerabilities: vulnStats.critical,
      trends: {
        securityScore: '+2%',
        activeThreats: '-3',
        complianceStatus: '+5%',
        assetsProtected: '+12'
      }
    }
  },

  async getRecentAlerts(limit = 10) {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data.map(alert => ({
      id: alert.id,
      severity: alert.severity,
      message: alert.title,
      time: this.formatTimeAgo(new Date(alert.created_at)),
      type: alert.alert_type,
      status: alert.status
    }))
  },

  formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }
}