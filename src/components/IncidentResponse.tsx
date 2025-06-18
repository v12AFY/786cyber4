import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  CheckCircle2, 
  Play,
  Pause,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  Shield,
  Eye,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  Activity
} from 'lucide-react';

const IncidentResponse = () => {
  const [activeTab, setActiveTab] = useState('incidents');
  const [statusFilter, setStatusFilter] = useState('all');

  const incidentStats = [
    {
      title: 'Active Incidents',
      value: '3',
      change: '-2',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Avg Response Time',
      value: '12m',
      change: '-5m',
      trend: 'down',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Resolved This Month',
      value: '47',
      change: '+12',
      trend: 'up',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Team Members',
      value: '8',
      change: '+1',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const incidents = [
    {
      id: 'INC-2024-001',
      title: 'Ransomware Attack Detected',
      description: 'Suspicious file encryption activity detected on multiple workstations',
      severity: 'Critical',
      status: 'Active',
      assignee: 'John Smith',
      createdAt: '2024-01-15 14:30:22',
      updatedAt: '2024-01-15 15:45:12',
      category: 'Malware',
      affectedSystems: ['HR-WS-05', 'Finance-WS-12', 'IT-WS-03'],
      priority: 'P1',
      sla: '2 hours',
      timeRemaining: '45 minutes'
    },
    {
      id: 'INC-2024-002',
      title: 'Data Breach Investigation',
      description: 'Unauthorized access to customer database detected',
      severity: 'High',
      status: 'Investigating',
      assignee: 'Sarah Johnson',
      createdAt: '2024-01-15 10:15:33',
      updatedAt: '2024-01-15 13:20:45',
      category: 'Data Breach',
      affectedSystems: ['DB-Server-01'],
      priority: 'P2',
      sla: '4 hours',
      timeRemaining: '2 hours 15 minutes'
    },
    {
      id: 'INC-2024-003',
      title: 'DDoS Attack Mitigation',
      description: 'Large scale DDoS attack targeting web services',
      severity: 'Medium',
      status: 'Contained',
      assignee: 'Mike Wilson',
      createdAt: '2024-01-15 08:45:11',
      updatedAt: '2024-01-15 12:30:22',
      category: 'Network Attack',
      affectedSystems: ['Web-Server-01', 'Load-Balancer-01'],
      priority: 'P3',
      sla: '8 hours',
      timeRemaining: 'Within SLA'
    }
  ];

  const responsePlaybooks = [
    {
      id: 'PB-001',
      title: 'Ransomware Response',
      description: 'Comprehensive playbook for ransomware incident response',
      steps: 8,
      estimatedTime: '2-4 hours',
      lastUpdated: '2024-01-10',
      category: 'Malware',
      difficulty: 'High'
    },
    {
      id: 'PB-002',
      title: 'Data Breach Investigation',
      description: 'Step-by-step data breach investigation and containment',
      steps: 12,
      estimatedTime: '4-8 hours',
      lastUpdated: '2024-01-08',
      category: 'Data Security',
      difficulty: 'High'
    },
    {
      id: 'PB-003',
      title: 'Phishing Email Response',
      description: 'Quick response protocol for phishing attacks',
      steps: 6,
      estimatedTime: '30-60 minutes',
      lastUpdated: '2024-01-12',
      category: 'Email Security',
      difficulty: 'Low'
    },
    {
      id: 'PB-004',
      title: 'Network Intrusion Response',
      description: 'Network security incident response and forensics',
      steps: 10,
      estimatedTime: '2-6 hours',
      lastUpdated: '2024-01-05',
      category: 'Network Security',
      difficulty: 'Medium'
    }
  ];

  const teamMembers = [
    {
      name: 'John Smith',
      role: 'Incident Commander',
      status: 'Available',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@company.com',
      activeIncidents: 1,
      expertise: ['Malware Analysis', 'Digital Forensics']
    },
    {
      name: 'Sarah Johnson',
      role: 'Security Analyst',
      status: 'Busy',
      phone: '+1 (555) 234-5678',
      email: 'sarah.johnson@company.com',
      activeIncidents: 2,
      expertise: ['Data Breach Investigation', 'Compliance']
    },
    {
      name: 'Mike Wilson',
      role: 'Network Security Engineer',
      status: 'Available',
      phone: '+1 (555) 345-6789',
      email: 'mike.wilson@company.com',
      activeIncidents: 1,
      expertise: ['Network Security', 'DDoS Mitigation']
    },
    {
      name: 'Emily Davis',
      role: 'Communications Coordinator',
      status: 'Available',
      phone: '+1 (555) 456-7890',
      email: 'emily.davis@company.com',
      activeIncidents: 0,
      expertise: ['Crisis Communication', 'Stakeholder Management']
    }
  ];

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
            <h1 className="text-2xl font-bold text-slate-900">Incident Response</h1>
            <p className="text-slate-600 mt-1">
              Security incident management and response coordination
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Report Incident</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Incident Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {incidentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <Activity className={`h-4 w-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
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

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('incidents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'incidents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Active Incidents
            </button>
            <button
              onClick={() => setActiveTab('playbooks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'playbooks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Response Playbooks
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'team'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Response Team
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Active Incidents Tab */}
          {activeTab === 'incidents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Security Incidents</h2>
                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="investigating">Investigating</option>
                    <option value="contained">Contained</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{incident.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                          <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded font-mono">
                            {incident.id}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-4">{incident.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Assignee</p>
                            <p className="text-slate-900">{incident.assignee}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Priority</p>
                            <p className="text-slate-900">{incident.priority}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">SLA</p>
                            <p className="text-slate-900">{incident.sla}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Time Remaining</p>
                            <p className={`font-medium ${
                              incident.timeRemaining.includes('minutes') && !incident.timeRemaining.includes('hours') 
                                ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {incident.timeRemaining}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-600 mb-2">Affected Systems</p>
                          <div className="flex flex-wrap gap-2">
                            {incident.affectedSystems.map((system, idx) => (
                              <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded">
                                {system}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>Created: {incident.createdAt}</span>
                          <span>Updated: {incident.updatedAt}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1">
                          <Play className="h-3 w-3" />
                          <span>Execute</span>
                        </button>
                        <button className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 transition-colors flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>Update</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Playbooks Tab */}
          {activeTab === 'playbooks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Incident Response Playbooks</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Create Playbook
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {responsePlaybooks.map((playbook) => (
                  <div key={playbook.id} className="p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">{playbook.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        playbook.difficulty === 'High' ? 'bg-red-100 text-red-700' :
                        playbook.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {playbook.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4">{playbook.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Steps:</span>
                        <span className="font-medium text-slate-900">{playbook.steps}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Estimated Time:</span>
                        <span className="font-medium text-slate-900">{playbook.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Category:</span>
                        <span className="font-medium text-slate-900">{playbook.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Last Updated:</span>
                        <span className="font-medium text-slate-900">{playbook.lastUpdated}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                        View Playbook
                      </button>
                      <button className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                        <FileText className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Incident Response Team</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Add Team Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{member.name}</h3>
                        <p className="text-sm text-slate-600">{member.role}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          member.status === 'Available' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-medium">{member.status}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{member.activeIncidents} active incidents</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-600 mb-2">Expertise</p>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                        Contact
                      </button>
                      <button className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                        <Calendar className="h-4 w-4 text-slate-600" />
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

export default IncidentResponse;