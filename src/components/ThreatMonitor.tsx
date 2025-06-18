import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Clock, 
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  Target,
  Globe,
  Server,
  Users
} from 'lucide-react';

const ThreatMonitor = () => {
  const [timeFilter, setTimeFilter] = useState('24h');
  const [severityFilter, setSeverityFilter] = useState('all');

  const threatStats = [
    {
      title: 'Active Threats',
      value: '7',
      change: '-3',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Blocked Attacks',
      value: '234',
      change: '+45',
      trend: 'up',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Threat Intelligence Feeds',
      value: '12',
      change: '0',
      trend: 'stable',
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'IOCs Detected',
      value: '89',
      change: '+12',
      trend: 'up',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const threatAlerts = [
    {
      id: '1',
      title: 'Suspicious PowerShell Activity',
      description: 'Encoded PowerShell command detected on FINANCE-WS-05',
      severity: 'High',
      category: 'Malware',
      source: 'EDR',
      timestamp: '2024-01-15 14:23:45',
      status: 'Active',
      affectedAssets: ['FINANCE-WS-05'],
      iocs: ['powershell.exe', 'base64 encoded command'],
      mitreTactic: 'Execution'
    },
    {
      id: '2',
      title: 'Brute Force Login Attempt',
      description: 'Multiple failed login attempts from suspicious IP',
      severity: 'Medium',
      category: 'Intrusion Attempt',
      source: 'Firewall',
      timestamp: '2024-01-15 13:45:12',
      status: 'Investigating',
      affectedAssets: ['Web Server'],
      iocs: ['185.220.101.45', 'admin username'],
      mitreTactic: 'Credential Access'
    },
    {
      id: '3',
      title: 'DNS Exfiltration Detected',
      description: 'Unusual DNS queries suggesting data exfiltration',
      severity: 'High',
      category: 'Data Exfiltration',
      source: 'Network Monitor',
      timestamp: '2024-01-15 12:15:33',
      status: 'Contained',
      affectedAssets: ['HR-WS-12'],
      iocs: ['malicious.evil-domain.com', 'DNS tunneling'],
      mitreTactic: 'Exfiltration'
    },
    {
      id: '4',
      title: 'Phishing Email Campaign',
      description: 'Targeted spear-phishing emails detected',
      severity: 'Medium',
      category: 'Social Engineering',
      source: 'Email Security',
      timestamp: '2024-01-15 10:30:22',
      status: 'Resolved',
      affectedAssets: ['Email System'],
      iocs: ['fake-invoice.pdf', 'spoofed sender'],
      mitreTactic: 'Initial Access'
    }
  ];

  const threatIntelligence = [
    {
      type: 'APT Group',
      name: 'APT29 (Cozy Bear)',
      description: 'Increased activity targeting financial sector',
      severity: 'High',
      confidence: 'High',
      lastUpdate: '2024-01-15',
      relevance: 95
    },
    {
      type: 'Malware Family',
      name: 'Emotet Variant',
      description: 'New variant bypassing email security',
      severity: 'Medium',
      confidence: 'Medium',
      lastUpdate: '2024-01-14',
      relevance: 78
    },
    {
      type: 'Vulnerability',
      name: 'CVE-2024-0001',
      description: 'Critical RCE in popular web framework',
      severity: 'Critical',
      confidence: 'High',
      lastUpdate: '2024-01-13',
      relevance: 88
    }
  ];

  const filteredAlerts = threatAlerts.filter(alert => {
    if (severityFilter !== 'all' && alert.severity.toLowerCase() !== severityFilter) {
      return false;
    }
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-red-100 text-red-700';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-700';
      case 'contained':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Threat Monitor</h1>
            <p className="text-slate-600 mt-1">
              Real-time threat detection and intelligence dashboard
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Monitoring Active</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Threat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {threatStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === 'up' ? 'text-red-600' : 
                  stat.trend === 'down' ? 'text-green-600' : 'text-slate-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 ${
                    stat.trend === 'down' ? 'rotate-180' : 
                    stat.trend === 'stable' ? 'rotate-90' : ''
                  }`} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-600">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Threat Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Active Threat Alerts</h2>
          <div className="flex items-center space-x-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-slate-900">{alert.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{alert.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-600">Category</p>
                      <p className="text-slate-900">{alert.category}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-600">Source</p>
                      <p className="text-slate-900">{alert.source}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-600">MITRE Tactic</p>
                      <p className="text-slate-900">{alert.mitreTactic}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-600">Timestamp</p>
                      <p className="text-slate-900">{alert.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-4">
                    <div>
                      <span className="text-sm font-medium text-slate-600">Affected Assets: </span>
                      {alert.affectedAssets.map((asset, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded ml-1">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-sm font-medium text-slate-600">IOCs: </span>
                    {alert.iocs.map((ioc, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded ml-1">
                        {ioc}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 hover:bg-slate-200 rounded">
                    <Eye className="h-4 w-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-200 rounded">
                    <MoreVertical className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Intelligence */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Threat Intelligence</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Intel
            </button>
          </div>
          
          <div className="space-y-4">
            {threatIntelligence.map((intel, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <h3 className="font-medium text-slate-900">{intel.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(intel.severity)}`}>
                    {intel.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{intel.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-500">Confidence: {intel.confidence}</span>
                    <span className="text-slate-500">Updated: {intel.lastUpdate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500">Relevance:</span>
                    <span className="font-medium text-slate-900">{intel.relevance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Vector Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Attack Vector Analysis</h2>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-slate-900">Email Phishing</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-red-600">45%</span>
                <p className="text-xs text-slate-600">of attacks</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-slate-900">Malicious Downloads</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-yellow-600">28%</span>
                <p className="text-xs text-slate-600">of attacks</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-slate-900">Brute Force</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">18%</span>
                <p className="text-xs text-slate-600">of attacks</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-slate-900">Other Vectors</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">9%</span>
                <p className="text-xs text-slate-600">of attacks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatMonitor;