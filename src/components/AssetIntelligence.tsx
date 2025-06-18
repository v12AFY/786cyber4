import React, { useState } from 'react';
import { 
  Server, 
  Monitor, 
  Smartphone, 
  Cloud, 
  Globe, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  BarChart3,
  Eye,
  Settings,
  Zap,
  HardDrive,
  Wifi,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useAssets } from '../hooks/useSecurityData';
import { assetAPI } from '../services/api';

const AssetIntelligence = () => {
  const [activeTab, setActiveTab] = useState('internal');
  const [searchTerm, setSearchTerm] = useState('');
  const [scanning, setScanning] = useState(false);
  
  const { assets, loading, scanAssets } = useAssets();

  const handleStartDiscovery = async () => {
    setScanning(true);
    try {
      const result = await scanAssets();
      if (result.success) {
        alert('Asset discovery completed successfully!');
      } else {
        alert(`Asset discovery failed: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to start asset discovery');
    } finally {
      setScanning(false);
    }
  };

  const assetStats = [
    {
      title: 'Total Assets',
      value: assets.length.toString(),
      change: '+15',
      icon: Server,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Critical Assets',
      value: assets.filter(a => a.criticality === 'High').length.toString(),
      change: '+2',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Monitored Endpoints',
      value: assets.filter(a => a.status === 'Online').length.toString(),
      change: '+8',
      icon: Monitor,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Vulnerabilities Found',
      value: assets.reduce((sum, asset) => sum + (asset.vulnerabilities || 0), 0).toString(),
      change: '-3',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const externalAssets = [
    {
      domain: 'company.com',
      type: 'Primary Domain',
      exposure: 'Web Server',
      risk: 'Medium',
      ssl: 'Valid until 2024-06-15',
      ports: ['80', '443', '25'],
      findings: 2
    },
    {
      domain: 'mail.company.com',
      type: 'Mail Server',
      exposure: 'Email Services',
      risk: 'Low',
      ssl: 'Valid until 2024-05-20',
      ports: ['25', '587', '993'],
      findings: 0
    },
    {
      domain: 'api.company.com',
      type: 'API Endpoint',
      exposure: 'REST API',
      risk: 'High',
      ssl: 'Expires in 7 days',
      ports: ['443', '8080'],
      findings: 5
    }
  ];

  const darkWebAlerts = [
    {
      type: 'Credential Leak',
      description: 'Employee credentials found on underground forum',
      severity: 'High',
      source: 'BreachDB',
      date: '2024-01-14',
      affected: 'john.doe@company.com'
    },
    {
      type: 'Company Mention',
      description: 'Company discussed in cybercrime marketplace',
      severity: 'Medium',
      source: 'DarkWeb Monitor',
      date: '2024-01-12',
      affected: 'Company reputation'
    }
  ];

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Asset Intelligence</h1>
            <p className="text-slate-600 mt-1">
              Comprehensive asset discovery and attack surface monitoring
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleStartDiscovery}
              disabled={scanning}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {scanning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              <span>{scanning ? 'Scanning...' : 'Start Discovery'}</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Asset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {assetStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-600">{stat.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('internal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'internal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Internal Assets
            </button>
            <button
              onClick={() => setActiveTab('external')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'external'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              External Surface
            </button>
            <button
              onClick={() => setActiveTab('darkweb')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'darkweb'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Dark Web Monitoring
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Internal Assets Tab */}
          {activeTab === 'internal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Internal Asset Discovery</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="flex items-center space-x-1 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-slate-600">Loading assets...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Asset</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Owner</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Criticality</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Vulnerabilities</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr key={asset.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-slate-900">{asset.name}</p>
                              <p className="text-sm text-slate-600">{asset.ip}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {asset.category === 'Server' && <Server className="h-4 w-4 text-blue-600" />}
                              {asset.category === 'Workstation' && <Monitor className="h-4 w-4 text-green-600" />}
                              {asset.category === 'IoT Device' && <Wifi className="h-4 w-4 text-purple-600" />}
                              <span className="text-sm">{asset.type}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-slate-600">{asset.owner}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              asset.criticality === 'High' ? 'bg-red-100 text-red-700' :
                              asset.criticality === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {asset.criticality}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                asset.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <span className="text-sm">{asset.status}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              (asset.vulnerabilities || 0) > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {asset.vulnerabilities || 0} found
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 hover:bg-slate-200 rounded">
                                <Eye className="h-4 w-4 text-slate-600" />
                              </button>
                              <button className="p-1 hover:bg-slate-200 rounded">
                                <Settings className="h-4 w-4 text-slate-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* External Surface Tab */}
          {activeTab === 'external' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">External Attack Surface</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Scan External Assets
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {externalAssets.map((asset, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-slate-900">{asset.domain}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        asset.risk === 'High' ? 'bg-red-100 text-red-700' :
                        asset.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {asset.risk} Risk
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Type</p>
                        <p className="text-sm text-slate-900">{asset.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">SSL Certificate</p>
                        <p className="text-sm text-slate-900">{asset.ssl}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Open Ports</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {asset.ports.map((port, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {port}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-slate-600">
                          {asset.findings} findings
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dark Web Monitoring Tab */}
          {activeTab === 'darkweb' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Dark Web Intelligence</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Configure Monitoring
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">High Priority Alerts</p>
                      <p className="text-2xl font-bold text-red-700 mt-1">3</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Monitored Keywords</p>
                      <p className="text-2xl font-bold text-yellow-700 mt-1">12</p>
                    </div>
                    <Eye className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Sources Monitored</p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">8</p>
                    </div>
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Recent Alerts</h3>
                {darkWebAlerts.map((alert, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-slate-900">{alert.type}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            alert.severity === 'High' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{alert.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>Source: {alert.source}</span>
                          <span>Date: {alert.date}</span>
                          <span>Affected: {alert.affected}</span>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                        Investigate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetIntelligence;