// API Service Layer for real data integration
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and provide fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is not available, provide demo data
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend not available, using demo mode');
      return Promise.resolve({ data: getDemoData(error.config) });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Don't redirect if we're already on the login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Demo data for when backend is not available
const getDemoData = (config: any) => {
  const url = config.url;
  
  if (url.includes('/auth/login')) {
    // Demo login - accept any credentials
    return {
      token: 'demo_token_' + Date.now(),
      user: {
        id: '1',
        email: 'demo@company.com',
        name: 'Demo User',
        role: 'Admin',
        department: 'IT'
      }
    };
  }
  
  if (url.includes('/auth/me')) {
    return {
      id: '1',
      email: 'demo@company.com',
      name: 'Demo User',
      role: 'Admin',
      department: 'IT'
    };
  }
  
  if (url.includes('/security/metrics')) {
    return {
      securityScore: 94,
      activeThreats: 2,
      complianceStatus: 87,
      assetsProtected: 156,
      trends: {
        securityScore: '+2%',
        activeThreats: '-3',
        complianceStatus: '+5%',
        assetsProtected: '+12'
      }
    };
  }
  
  if (url.includes('/security/alerts/recent')) {
    return [
      {
        id: '1',
        severity: 'high',
        message: 'Suspicious login attempt detected from unusual location',
        time: '2 minutes ago',
        type: 'Access Control',
        status: 'active'
      },
      {
        id: '2',
        severity: 'medium',
        message: 'SSL certificate expires in 7 days for mail.company.com',
        time: '1 hour ago',
        type: 'Infrastructure',
        status: 'acknowledged'
      }
    ];
  }
  
  // Default empty response
  return {};
};

// Authentication APIs
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: any) => 
    api.post('/auth/register', userData),
  getCurrentUser: () => 
    api.get('/auth/me'),
  logout: () => 
    api.post('/auth/logout'),
  refreshToken: () => 
    api.post('/auth/refresh'),
};

// Security Dashboard APIs
export const securityAPI = {
  getSecurityMetrics: () => api.get('/security/metrics'),
  getRecentAlerts: () => api.get('/security/alerts/recent'),
  getComplianceStatus: () => api.get('/compliance/status'),
  runSecurityScan: () => api.post('/security/scan'),
};

// Asset Management APIs
export const assetAPI = {
  getAssets: (filters?: any) => api.get('/assets', { params: filters }),
  scanAssets: () => api.post('/assets/scan'),
  getAssetDetails: (id: string) => api.get(`/assets/${id}`),
  updateAsset: (id: string, data: any) => api.put(`/assets/${id}`, data),
  getExternalSurface: () => api.get('/assets/external-surface'),
  getDarkWebAlerts: () => api.get('/assets/dark-web-alerts'),
};

// Vulnerability Management APIs
export const vulnerabilityAPI = {
  getVulnerabilities: (filters?: any) => api.get('/vulnerabilities', { params: filters }),
  runVulnerabilityScan: () => api.post('/vulnerabilities/scan'),
  getVulnerabilityDetails: (id: string) => api.get(`/vulnerabilities/${id}`),
  markAsResolved: (id: string) => api.patch(`/vulnerabilities/${id}/resolve`),
  getRemediationPlaybooks: () => api.get('/vulnerabilities/playbooks'),
  executePlaybook: (id: string, targets: string[]) => api.post(`/vulnerabilities/playbooks/${id}/execute`, { targets }),
};

// User Management APIs
export const userAPI = {
  getUsers: (filters?: any) => api.get('/users', { params: filters }),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  getUserRiskScore: (id: string) => api.get(`/users/${id}/risk-score`),
  enableMFA: (id: string) => api.post(`/users/${id}/mfa/enable`),
  syncDirectory: () => api.post('/users/sync-directory'),
  getAccessRisks: () => api.get('/users/access-risks'),
};

// Threat Monitoring APIs
export const threatAPI = {
  getThreatAlerts: (filters?: any) => api.get('/threats/alerts', { params: filters }),
  getThreatIntelligence: () => api.get('/threats/intelligence'),
  getAttackVectors: () => api.get('/threats/attack-vectors'),
  acknowledgeAlert: (id: string) => api.patch(`/threats/alerts/${id}/acknowledge`),
  escalateAlert: (id: string) => api.patch(`/threats/alerts/${id}/escalate`),
};

// Incident Response APIs
export const incidentAPI = {
  getIncidents: (filters?: any) => api.get('/incidents', { params: filters }),
  createIncident: (incidentData: any) => api.post('/incidents', incidentData),
  updateIncident: (id: string, data: any) => api.put(`/incidents/${id}`, data),
  getPlaybooks: () => api.get('/incidents/playbooks'),
  executePlaybook: (id: string, incidentId: string) => api.post(`/incidents/playbooks/${id}/execute`, { incidentId }),
  getTeamMembers: () => api.get('/incidents/team'),
};

// Compliance APIs
export const complianceAPI = {
  getFrameworks: () => api.get('/compliance/frameworks'),
  getFrameworkStatus: (id: string) => api.get(`/compliance/frameworks/${id}/status`),
  generatePolicy: (templateId: string, params: any) => api.post('/compliance/policies/generate', { templateId, params }),
  getPolicyTemplates: () => api.get('/compliance/policy-templates'),
  getComplianceTasks: () => api.get('/compliance/tasks'),
  updateTaskStatus: (id: string, status: string) => api.patch(`/compliance/tasks/${id}`, { status }),
};

// Reports & Analytics APIs
export const reportsAPI = {
  getReportStats: () => api.get('/reports/stats'),
  getAvailableReports: () => api.get('/reports/available'),
  generateReport: (reportId: string, params: any) => api.post(`/reports/${reportId}/generate`, params),
  getScheduledReports: () => api.get('/reports/scheduled'),
  scheduleReport: (reportData: any) => api.post('/reports/schedule', reportData),
  getKPIMetrics: (timeRange: string) => api.get('/reports/kpi', { params: { timeRange } }),
};

// System Settings APIs
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings: any) => api.put('/settings', settings),
  getIntegrations: () => api.get('/settings/integrations'),
  connectIntegration: (integrationId: string, config: any) => api.post(`/settings/integrations/${integrationId}/connect`, config),
  disconnectIntegration: (integrationId: string) => api.post(`/settings/integrations/${integrationId}/disconnect`),
  getAPIKeys: () => api.get('/settings/api-keys'),
  generateAPIKey: (keyData: any) => api.post('/settings/api-keys', keyData),
  revokeAPIKey: (keyId: string) => api.delete(`/settings/api-keys/${keyId}`),
  getBackupSchedules: () => api.get('/settings/backups'),
  createBackup: () => api.post('/settings/backups/create'),
};

export default api;