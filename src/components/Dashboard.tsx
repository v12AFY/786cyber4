import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Server, 
  Lock,
  Eye,
  BarChart3,
  DollarSign,
  Zap,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useSecurityMetrics, useRecentAlerts } from '../hooks/useSecurityData';
import { securityAPI } from '../services/api';

const Dashboard = () => {
  const { metrics, loading: metricsLoading } = useSecurityMetrics();
  const { alerts, loading: alertsLoading } = useRecentAlerts();

  const handleRunScan = async () => {
    try {
      await securityAPI.runSecurityScan();
      // Show success notification
      alert('Security scan initiated successfully!');
    } catch (error) {
      alert('Failed to start security scan. Please try again.');
    }
  };

  const securityMetrics = [
    { 
      title: 'Security Score', 
      value: metrics?.securityScore ? `${metrics.securityScore}%` : '94%', 
      change: metrics?.trends?.securityScore || '+2%', 
      trend: 'up', 
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Active Threats', 
      value: metrics?.activeThreats?.toString() || '2', 
      change: metrics?.trends?.activeThreats || '-3', 
      trend: 'down', 
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    { 
      title: 'Compliance Status', 
      value: metrics?.complianceStatus ? `${metrics.complianceStatus}%` : '87%', 
      change: metrics?.trends?.complianceStatus || '+5%', 
      trend: 'up', 
      icon: CheckCircle2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Assets Protected', 
      value: metrics?.assetsProtected?.toString() || '156', 
      change: metrics?.trends?.assetsProtected || '+12', 
      trend: 'up', 
      icon: Server,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const complianceFrameworks = [
    { name: 'NIST CSF', progress: 87, requirements: 23, completed: 20 },
    { name: 'ISO 27001', progress: 72, requirements: 35, completed: 25 },
    { name: 'GDPR', progress: 94, requirements: 18, completed: 17 },
    { name: 'PCI-DSS', progress: 65, requirements: 12, completed: 8 }
  ];

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-slate-600">Loading security dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Security Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Real-time overview of your organization's security posture
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">All Systems Operational</span>
            </div>
            <button 
              onClick={handleRunScan}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Run Security Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-600">{metric.title}</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Security Alerts */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Security Alerts</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Alerts
            </button>
          </div>
          
          {alertsLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: any, index: number) => (
                <div key={alert.id || index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    alert.severity === 'high' ? 'bg-red-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">{alert.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                      <span>{alert.time}</span>
                      <span className="bg-slate-200 px-2 py-1 rounded text-xs">
                        {alert.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        alert.status === 'active' ? 'bg-red-100 text-red-700' :
                        alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-blue-900 font-medium">Run Vulnerability Scan</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-green-900 font-medium">Review User Permissions</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <Lock className="h-5 w-5 text-purple-600" />
              <span className="text-purple-900 font-medium">Generate Security Report</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <Globe className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-900 font-medium">Check Attack Surface</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Compliance Frameworks</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Manage Compliance
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceFrameworks.map((framework, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">{framework.name}</h3>
                <span className="text-sm text-slate-600">{framework.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${framework.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-600">
                {framework.completed} of {framework.requirements} requirements met
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Investment ROI */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Security Investment ROI</h2>
            <p className="text-sm text-slate-600">Cost vs. risk reduction analysis</p>
          </div>
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">$47K</p>
            <p className="text-sm text-slate-600">Potential Loss Prevented</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">$12K</p>
            <p className="text-sm text-slate-600">Monthly Security Investment</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">3.9x</p>
            <p className="text-sm text-slate-600">Return on Investment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;