import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  Eye,
  Share,
  Clock,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Users,
  Server,
  Globe,
  FileText,
  Mail,
  Settings
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [reportType, setReportType] = useState('all');

  const reportStats = [
    {
      title: 'Reports Generated',
      value: '156',
      change: '+23',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Scheduled Reports',
      value: '12',
      change: '+3',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Executive Dashboards',
      value: '8',
      change: '+2',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Compliance Reports',
      value: '24',
      change: '+6',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const availableReports = [
    {
      id: 'RPT-001',
      title: 'Executive Security Dashboard',
      description: 'High-level security posture overview for executive leadership',
      category: 'Executive',
      frequency: 'Weekly',
      lastGenerated: '2024-01-15',
      recipients: ['CEO', 'CISO', 'Board'],
      format: 'PDF',
      automated: true,
      popularity: 95
    },
    {
      id: 'RPT-002',
      title: 'Vulnerability Assessment Report',
      description: 'Detailed vulnerability scan results and remediation recommendations',
      category: 'Technical',
      frequency: 'Monthly',
      lastGenerated: '2024-01-12',
      recipients: ['Security Team', 'IT Manager'],
      format: 'PDF + Excel',
      automated: true,
      popularity: 88
    },
    {
      id: 'RPT-003',
      title: 'Compliance Status Report',
      description: 'GDPR, HIPAA, and PCI-DSS compliance status and gap analysis',
      category: 'Compliance',
      frequency: 'Quarterly',
      lastGenerated: '2024-01-01',
      recipients: ['Legal', 'Compliance Officer', 'Auditors'],
      format: 'PDF',
      automated: false,
      popularity: 92
    },
    {
      id: 'RPT-004',
      title: 'Incident Response Summary',
      description: 'Security incidents, response times, and lessons learned',
      category: 'Operational',
      frequency: 'Monthly',
      lastGenerated: '2024-01-10',
      recipients: ['Security Team', 'Management'],
      format: 'PDF',
      automated: true,
      popularity: 76
    },
    {
      id: 'RPT-005',
      title: 'User Access Review',
      description: 'User permissions audit and access governance report',
      category: 'Governance',
      frequency: 'Quarterly',
      lastGenerated: '2024-01-05',
      recipients: ['HR', 'IT Manager', 'Department Heads'],
      format: 'Excel',
      automated: false,
      popularity: 84
    },
    {
      id: 'RPT-006',
      title: 'Security Training Metrics',
      description: 'Employee security awareness training completion and effectiveness',
      category: 'Training',
      frequency: 'Monthly',
      lastGenerated: '2024-01-08',
      recipients: ['HR', 'Training Manager', 'CISO'],
      format: 'PDF + Dashboard',
      automated: true,
      popularity: 71
    }
  ];

  const scheduledReports = [
    {
      name: 'Weekly Executive Brief',
      nextRun: '2024-01-22 09:00',
      frequency: 'Weekly',
      recipients: 3,
      status: 'Active'
    },
    {
      name: 'Monthly Vulnerability Report',
      nextRun: '2024-02-01 08:00',
      frequency: 'Monthly',
      recipients: 5,
      status: 'Active'
    },
    {
      name: 'Quarterly Compliance Review',
      nextRun: '2024-04-01 10:00',
      frequency: 'Quarterly',
      recipients: 8,
      status: 'Pending'
    }
  ];

  const kpiMetrics = [
    {
      category: 'Security Posture',
      metrics: [
        { name: 'Overall Security Score', value: '94%', trend: 'up', change: '+2%' },
        { name: 'Critical Vulnerabilities', value: '12', trend: 'down', change: '-4' },
        { name: 'Mean Time to Detect', value: '8.5h', trend: 'down', change: '-1.2h' },
        { name: 'Mean Time to Respond', value: '2.3h', trend: 'down', change: '-0.5h' }
      ]
    },
    {
      category: 'Compliance',
      metrics: [
        { name: 'GDPR Compliance', value: '94%', trend: 'up', change: '+3%' },
        { name: 'ISO 27001 Readiness', value: '87%', trend: 'up', change: '+5%' },
        { name: 'Policy Acknowledgment', value: '91%', trend: 'up', change: '+2%' },
        { name: 'Audit Findings', value: '3', trend: 'down', change: '-2' }
      ]
    },
    {
      category: 'User Behavior',
      metrics: [
        { name: 'Phishing Test Pass Rate', value: '92%', trend: 'up', change: '+4%' },
        { name: 'Training Completion', value: '87%', trend: 'up', change: '+6%' },
        { name: 'Password Policy Compliance', value: '96%', trend: 'stable', change: '0%' },
        { name: 'MFA Adoption', value: '89%', trend: 'up', change: '+8%' }
      ]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'executive':
        return 'bg-purple-100 text-purple-700';
      case 'technical':
        return 'bg-blue-100 text-blue-700';
      case 'compliance':
        return 'bg-green-100 text-green-700';
      case 'operational':
        return 'bg-yellow-100 text-yellow-700';
      case 'governance':
        return 'bg-red-100 text-red-700';
      case 'training':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-slate-400 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
            <p className="text-slate-600 mt-1">
              Comprehensive security reporting and business intelligence
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => {
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

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Key Performance Indicators</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Detailed Analytics
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {kpiMetrics.map((category, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium text-slate-900 mb-4">{category.category}</h3>
              <div className="space-y-3">
                {category.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{metric.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-slate-900">{metric.value}</span>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-xs ${
                            metric.trend === 'up' ? 'text-green-600' :
                            metric.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                          }`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Available Reports</h2>
            <div className="flex items-center space-x-2">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="executive">Executive</option>
                <option value="technical">Technical</option>
                <option value="compliance">Compliance</option>
                <option value="operational">Operational</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {availableReports.map((report) => (
              <div key={report.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-slate-900">{report.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(report.category)}`}>
                        {report.category}
                      </span>
                      {report.automated && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Auto
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Frequency: {report.frequency}</span>
                      <span>Last: {report.lastGenerated}</span>
                      <span>Format: {report.format}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 ml-4">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                      Generate
                    </button>
                    <button className="bg-slate-600 text-white px-3 py-1 rounded text-xs hover:bg-slate-700 transition-colors">
                      Schedule
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{report.recipients.length} recipients</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-slate-500">Popularity:</span>
                    <span className="text-xs font-medium text-slate-700">{report.popularity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Scheduled Reports</h2>
            <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
              Add Schedule
            </button>
          </div>
          
          <div className="space-y-4">
            {scheduledReports.map((schedule, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{schedule.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    schedule.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {schedule.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Next Run</p>
                    <p className="font-medium text-slate-900">{schedule.nextRun}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Frequency</p>
                    <p className="font-medium text-slate-900">{schedule.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{schedule.recipients} recipients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <Eye className="h-4 w-4 text-slate-600" />
                    </button>
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <Settings className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="font-medium text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                <BarChart3 className="h-5 w-5 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-blue-900">Custom Dashboard</p>
              </button>
              <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                <Target className="h-5 w-5 text-green-600 mb-2" />
                <p className="text-sm font-medium text-green-900">KPI Builder</p>
              </button>
              <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                <Share className="h-5 w-5 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-purple-900">Share Report</p>
              </button>
              <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                <Calendar className="h-5 w-5 text-orange-600 mb-2" />
                <p className="text-sm font-medium text-orange-900">Report Calendar</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;