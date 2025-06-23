import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import type { Database } from '../config/supabase';

type Tables = Database['public']['Tables'];

// Asset Service
export class AssetService {
  async getAssets(tenantId: string, filters: {
    category?: string;
    criticality?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      let query = supabase
        .from('assets')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.criticality) {
        query = query.eq('criticality', filters.criticality);
      }
      if (filters.status) {
        query = query.eq('asset_status', filters.status);
      }
      if (filters.search) {
        query = query.or(`asset_name.ilike.%${filters.search}%,hostname.ilike.%${filters.search}%`);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        assets: data || [],
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      logger.error('Error fetching assets:', error);
      throw error;
    }
  }

  async createAsset(assetData: Tables['assets']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert(assetData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating asset:', error);
      throw error;
    }
  }

  async updateAsset(id: string, updates: Tables['assets']['Update']) {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating asset:', error);
      throw error;
    }
  }

  async deleteAsset(id: string) {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      logger.error('Error deleting asset:', error);
      throw error;
    }
  }
}

// Vulnerability Service
export class VulnerabilityService {
  async getVulnerabilities(tenantId: string, filters: {
    severity?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      let query = supabase
        .from('vulnerabilities')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.status) {
        query = query.eq('vuln_status', filters.status);
      }
      if (filters.category) {
        query = query.eq('vuln_category', filters.category);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        vulnerabilities: data || [],
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      logger.error('Error fetching vulnerabilities:', error);
      throw error;
    }
  }

  async createVulnerability(vulnData: Tables['vulnerabilities']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('vulnerabilities')
        .insert(vulnData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating vulnerability:', error);
      throw error;
    }
  }

  async updateVulnerability(id: string, updates: Tables['vulnerabilities']['Update']) {
    try {
      const { data, error } = await supabase
        .from('vulnerabilities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating vulnerability:', error);
      throw error;
    }
  }
}

// Security Alert Service
export class SecurityAlertService {
  async getSecurityAlerts(tenantId: string, filters: {
    severity?: string;
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  } = {}) {
    try {
      let query = supabase
        .from('security_alerts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.status) {
        query = query.eq('alert_status', filters.status);
      }
      if (filters.type) {
        query = query.eq('alert_type', filters.type);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        alerts: data || [],
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      logger.error('Error fetching security alerts:', error);
      throw error;
    }
  }

  async createSecurityAlert(alertData: Tables['security_alerts']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .insert(alertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating security alert:', error);
      throw error;
    }
  }

  async updateSecurityAlert(id: string, updates: Tables['security_alerts']['Update']) {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating security alert:', error);
      throw error;
    }
  }
}

// User Service
export class UserService {
  async getTenantUsers(tenantId: string) {
    try {
      const { data, error } = await supabase
        .from('tenant_users')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching tenant users:', error);
      throw error;
    }
  }

  async createTenantUser(userData: Tables['tenant_users']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('tenant_users')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating tenant user:', error);
      throw error;
    }
  }

  async updateTenantUser(id: string, updates: Tables['tenant_users']['Update']) {
    try {
      const { data, error } = await supabase
        .from('tenant_users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating tenant user:', error);
      throw error;
    }
  }
}

// Analytics Service
export class AnalyticsService {
  async getDashboardMetrics(tenantId: string) {
    try {
      // Get asset statistics
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('criticality, asset_status, vulnerability_count')
        .eq('tenant_id', tenantId);

      if (assetsError) throw assetsError;

      // Get vulnerability statistics
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('vulnerabilities')
        .select('severity, vuln_status')
        .eq('tenant_id', tenantId);

      if (vulnError) throw vulnError;

      // Get security alerts
      const { data: alerts, error: alertsError } = await supabase
        .from('security_alerts')
        .select('severity, alert_status')
        .eq('tenant_id', tenantId)
        .eq('alert_status', 'open');

      if (alertsError) throw alertsError;

      // Calculate metrics
      const totalAssets = assets?.length || 0;
      const criticalVulns = vulnerabilities?.filter(v => v.severity === 'critical' && v.vuln_status === 'open').length || 0;
      const activeThreats = alerts?.length || 0;
      
      // Calculate security score (simplified)
      const securityScore = Math.max(0, 100 - (criticalVulns * 10) - (activeThreats * 5));

      return {
        securityScore,
        activeThreats,
        complianceStatus: 87, // This would be calculated from compliance_frameworks table
        assetsProtected: totalAssets,
        criticalVulnerabilities: criticalVulns,
        trends: {
          securityScore: '+2%',
          activeThreats: '-3',
          complianceStatus: '+5%',
          assetsProtected: '+12'
        }
      };
    } catch (error) {
      logger.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  async getRecentAlerts(tenantId: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(alert => ({
        id: alert.id,
        severity: alert.severity,
        message: alert.alert_title,
        time: this.formatTimeAgo(new Date(alert.created_at)),
        type: alert.alert_type,
        status: alert.alert_status
      }));
    } catch (error) {
      logger.error('Error fetching recent alerts:', error);
      throw error;
    }
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  }
}

// Export service instances
export const assetService = new AssetService();
export const vulnerabilityService = new VulnerabilityService();
export const securityAlertService = new SecurityAlertService();
export const userService = new UserService();
export const analyticsService = new AnalyticsService();