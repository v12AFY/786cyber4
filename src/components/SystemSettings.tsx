import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Users, 
  Database,
  Globe,
  Key,
  Mail,
  Smartphone,
  Clock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    slackIntegration: true,
    weeklyReports: true,
    criticalOnly: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    mfaRequired: true,
    ipWhitelist: true,
    auditLogging: true
  });

  const integrations = [
    {
      name: 'Microsoft 365',
      type: 'Identity Provider',
      status: 'Connected',
      lastSync: '2024-01-15 10:30',
      users: 156,
      icon: '🏢'
    },
    {
      name: 'Slack',
      type: 'Notifications',
      status: 'Connected',
      lastSync: '2024-01-15 09:45',
      users: 45,
      icon: '💬'
    },
    {
      name: 'Splunk',
      type: 'SIEM',
      status: 'Disconnected',
      lastSync: 'Never',
      users: 0,
      icon: '📊'
    },
    {
      name: 'CrowdStrike',
      type: 'EDR',
      status: 'Connected',
      lastSync: '2024-01-15 11:15',
      users: 134,
      icon: '🛡️'
    }
  ];

  const apiKeys = [
    {
      name: 'Vulnerability Scanner API',
      key: 'sk_live_51H...xyz',
      created: '2024-01-01',
      lastUsed: '2024-01-15',
      permissions: ['read', 'write'],
      status: 'Active'
    },
    {
      name: 'Threat Intelligence Feed',
      key: 'ti_prod_abc...123',
      created: '2023-12-15',
      lastUsed: '2024-01-14',
      permissions: ['read'],
      status: 'Active'
    },
    {
      name: 'Backup Service',
      key: 'bk_test_def...456',
      created: '2024-01-10',
      lastUsed: 'Never',
      permissions: ['read', 'write', 'delete'],
      status: 'Inactive'
    }
  ];

  const backupSchedules = [
    {
      name: 'Daily Configuration Backup',
      frequency: 'Daily at 2:00 AM',
      retention: '30 days',
      lastBackup: '2024-01-15 02:00',
      status: 'Success',
      size: '2.3 MB'
    },
    {
      name: 'Weekly Full System Backup',
      frequency: 'Weekly on Sunday',
      retention: '12 weeks',
      lastBackup: '2024-01-14 03:00',
      status: 'Success',
      size: '156 MB'
    },
    {
      name: 'Monthly Archive',
      frequency: 'Monthly on 1st',
      retention: '12 months',
      lastBackup: '2024-01-01 04:00',
      status: 'Success',
      size: '1.2 GB'
    }
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
            <p className="text-slate-600 mt-1">
              Configure system preferences, integrations, and security settings
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
            <button className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'integrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Integrations
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'backup'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Backup & Recovery
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Organization Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      defaultValue="786 Cyber Technologies"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Industry
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Technology</option>
                      <option>Healthcare</option>
                      <option>Financial Services</option>
                      <option>Manufacturing</option>
                      <option>Retail</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Size
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>1-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>500+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European Time)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">System Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Dark Mode</h3>
                      <p className="text-sm text-slate-600">Enable dark theme for the interface</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Auto-refresh Dashboard</h3>
                      <p className="text-sm text-slate-600">Automatically refresh dashboard data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Data Retention</h3>
                      <p className="text-sm text-slate-600">How long to keep historical data</p>
                    </div>
                    <select className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>90 days</option>
                      <option>6 months</option>
                      <option>1 year</option>
                      <option>2 years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Authentication & Access</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Require Multi-Factor Authentication</h3>
                      <p className="text-sm text-slate-600">Enforce MFA for all user accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={securitySettings.mfaRequired}
                        onChange={(e) => handleSecurityChange('mfaRequired', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Session Timeout</h3>
                      <p className="text-sm text-slate-600">Automatically log out inactive users</p>
                    </div>
                    <select 
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="240">4 hours</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Password Policy</h3>
                      <p className="text-sm text-slate-600">Minimum password requirements</p>
                    </div>
                    <select 
                      value={securitySettings.passwordPolicy}
                      onChange={(e) => handleSecurityChange('passwordPolicy', e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="basic">Basic (8+ characters)</option>
                      <option value="strong">Strong (12+ chars, mixed case, numbers)</option>
                      <option value="complex">Complex (16+ chars, symbols required)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">API Keys & Access Tokens</h2>
                <div className="space-y-4">
                  {apiKeys.map((apiKey, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900">{apiKey.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          apiKey.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {apiKey.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          {showApiKey ? apiKey.key : '••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center space-x-4">
                          <span>Created: {apiKey.created}</span>
                          <span>Last used: {apiKey.lastUsed}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">Edit</button>
                          <button className="text-red-600 hover:text-red-700">Revoke</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors flex items-center justify-center space-x-2 text-slate-600 hover:text-blue-600">
                    <Plus className="h-4 w-4" />
                    <span>Generate New API Key</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Alert Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <h3 className="font-medium text-slate-900">Email Alerts</h3>
                        <p className="text-sm text-slate-600">Receive security alerts via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.emailAlerts}
                        onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-slate-400" />
                      <div>
                        <h3 className="font-medium text-slate-900">SMS Alerts</h3>
                        <p className="text-sm text-slate-600">Receive critical alerts via SMS</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.smsAlerts}
                        onChange={(e) => handleNotificationChange('smsAlerts', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-slate-400" />
                      <div>
                        <h3 className="font-medium text-slate-900">Slack Integration</h3>
                        <p className="text-sm text-slate-600">Send alerts to Slack channels</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.slackIntegration}
                        onChange={(e) => handleNotificationChange('slackIntegration', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Report Delivery</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Weekly Security Reports</h3>
                      <p className="text-sm text-slate-600">Automated weekly security summary</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.weeklyReports}
                        onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Report Recipients
                    </label>
                    <input
                      type="text"
                      defaultValue="ciso@company.com, security-team@company.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email addresses separated by commas"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Connected Services</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Integration
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((integration, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                          <p className="text-sm text-slate-600">{integration.type}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        integration.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex justify-between">
                        <span>Last Sync:</span>
                        <span>{integration.lastSync}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span>{integration.users}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                        integration.status === 'Connected' 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}>
                        {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                      </button>
                      <button className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-100 transition-colors">
                        <Settings className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backup & Recovery Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Backup Schedules</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Create Backup
                </button>
              </div>
              
              <div className="space-y-4">
                {backupSchedules.map((backup, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{backup.name}</h3>
                        <p className="text-sm text-slate-600">{backup.frequency}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        backup.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {backup.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Last Backup</p>
                        <p className="font-medium text-slate-900">{backup.lastBackup}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Retention</p>
                        <p className="font-medium text-slate-900">{backup.retention}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Size</p>
                        <p className="font-medium text-slate-900">{backup.size}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Run Now
                      </button>
                      <button className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 transition-colors">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Disaster Recovery</h3>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  Configure disaster recovery settings to ensure business continuity in case of system failures.
                </p>
                <div className="flex space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Configure DR
                  </button>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors">
                    Test Recovery
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;