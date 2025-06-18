import React, { useState } from 'react';
import { 
  FileText, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Download,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building,
  Globe
} from 'lucide-react';

const SecurityPolicies = () => {
  const [activeTab, setActiveTab] = useState('policies');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const policyStats = [
    {
      title: 'Total Policies',
      value: '24',
      change: '+3',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Policies Due for Review',
      value: '6',
      change: '+2',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Compliance Rate',
      value: '94%',
      change: '+2%',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Employee Acknowledgment',
      value: '87%',
      change: '+5%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const policies = [
    {
      id: 'POL-001',
      title: 'Information Security Policy',
      description: 'Comprehensive information security framework and guidelines',
      category: 'Security',
      version: '2.1',
      status: 'Active',
      lastReviewed: '2024-01-01',
      nextReview: '2024-07-01',
      owner: 'CISO',
      approver: 'CEO',
      acknowledgmentRate: 95,
      frameworks: ['ISO 27001', 'NIST CSF'],
      criticality: 'High'
    },
    {
      id: 'POL-002',
      title: 'Data Protection and Privacy Policy',
      description: 'GDPR-compliant data handling and privacy protection guidelines',
      category: 'Privacy',
      version: '1.8',
      status: 'Active',
      lastReviewed: '2023-12-15',
      nextReview: '2024-06-15',
      owner: 'DPO',
      approver: 'Legal',
      acknowledgmentRate: 92,
      frameworks: ['GDPR', 'CCPA'],
      criticality: 'High'
    },
    {
      id: 'POL-003',
      title: 'Remote Work Security Policy',
      description: 'Security requirements for remote and hybrid work environments',
      category: 'Operations',
      version: '1.3',
      status: 'Under Review',
      lastReviewed: '2023-11-20',
      nextReview: '2024-02-20',
      owner: 'IT Manager',
      approver: 'CISO',
      acknowledgmentRate: 78,
      frameworks: ['NIST CSF'],
      criticality: 'Medium'
    },
    {
      id: 'POL-004',
      title: 'Incident Response Policy',
      description: 'Procedures for security incident detection, response, and recovery',
      category: 'Security',
      version: '2.0',
      status: 'Active',
      lastReviewed: '2024-01-10',
      nextReview: '2024-07-10',
      owner: 'Security Team',
      approver: 'CISO',
      acknowledgmentRate: 88,
      frameworks: ['NIST CSF', 'ISO 27001'],
      criticality: 'High'
    },
    {
      id: 'POL-005',
      title: 'Access Control Policy',
      description: 'User access management and privilege control guidelines',
      category: 'Access Management',
      version: '1.5',
      status: 'Draft',
      lastReviewed: '2023-10-05',
      nextReview: '2024-04-05',
      owner: 'Identity Team',
      approver: 'CISO',
      acknowledgmentRate: 0,
      frameworks: ['NIST CSF', 'ISO 27001'],
      criticality: 'High'
    }
  ];

  const policyTemplates = [
    {
      name: 'Acceptable Use Policy',
      description: 'Guidelines for appropriate use of company IT resources',
      category: 'Operations',
      estimatedTime: '15 minutes',
      frameworks: ['ISO 27001'],
      complexity: 'Low'
    },
    {
      name: 'Business Continuity Policy',
      description: 'Procedures for maintaining operations during disruptions',
      category: 'Business Continuity',
      estimatedTime: '30 minutes',
      frameworks: ['ISO 22301', 'NIST CSF'],
      complexity: 'Medium'
    },
    {
      name: 'Vendor Management Policy',
      description: 'Security requirements for third-party vendors and suppliers',
      category: 'Third Party',
      estimatedTime: '25 minutes',
      frameworks: ['ISO 27001', 'SOC 2'],
      complexity: 'Medium'
    },
    {
      name: 'Mobile Device Policy',
      description: 'Security controls for mobile devices and BYOD programs',
      category: 'Device Management',
      estimatedTime: '20 minutes',
      frameworks: ['NIST CSF'],
      complexity: 'Low'
    }
  ];

  const trainingModules = [
    {
      title: 'Security Awareness Fundamentals',
      description: 'Basic cybersecurity awareness for all employees',
      duration: '45 minutes',
      completionRate: 94,
      lastUpdated: '2024-01-15',
      mandatory: true,
      audience: 'All Employees'
    },
    {
      title: 'Data Protection and Privacy',
      description: 'GDPR compliance and data handling best practices',
      duration: '30 minutes',
      completionRate: 87,
      lastUpdated: '2024-01-10',
      mandatory: true,
      audience: 'All Employees'
    },
    {
      title: 'Phishing Recognition',
      description: 'Identifying and responding to phishing attempts',
      duration: '20 minutes',
      completionRate: 91,
      lastUpdated: '2024-01-12',
      mandatory: true,
      audience: 'All Employees'
    },
    {
      title: 'Incident Response Training',
      description: 'Advanced incident response procedures for security team',
      duration: '2 hours',
      completionRate: 75,
      lastUpdated: '2024-01-08',
      mandatory: false,
      audience: 'Security Team'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'under review':
        return 'bg-yellow-100 text-yellow-700';
      case 'draft':
        return 'bg-blue-100 text-blue-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality.toLowerCase()) {
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

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || policy.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Security Policies</h1>
            <p className="text-slate-600 mt-1">
              Policy management, compliance tracking, and employee training
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Policy</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Policy Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {policyStats.map((stat, index) => {
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
              onClick={() => setActiveTab('policies')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'policies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Policy Library
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Policy Templates
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'training'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Training & Awareness
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Policy Library Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Policy Library</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search policies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="security">Security</option>
                    <option value="privacy">Privacy</option>
                    <option value="operations">Operations</option>
                    <option value="access management">Access Management</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredPolicies.map((policy) => (
                  <div key={policy.id} className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{policy.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(policy.status)}`}>
                            {policy.status}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCriticalityColor(policy.criticality)}`}>
                            {policy.criticality}
                          </span>
                          <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded font-mono">
                            v{policy.version}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-4">{policy.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Owner</p>
                            <p className="text-slate-900">{policy.owner}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Last Reviewed</p>
                            <p className="text-slate-900">{policy.lastReviewed}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Next Review</p>
                            <p className="text-slate-900">{policy.nextReview}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Acknowledgment</p>
                            <p className="text-slate-900">{policy.acknowledgmentRate}%</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-600 mb-2">Compliance Frameworks</p>
                          <div className="flex flex-wrap gap-2">
                            {policy.frameworks.map((framework, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {framework}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${policy.acknowledgmentRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1">
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 transition-colors flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policy Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Policy Templates</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Upload Custom Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {policyTemplates.map((template, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">{template.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        template.complexity === 'High' ? 'bg-red-100 text-red-700' :
                        template.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {template.complexity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Category:</span>
                        <span className="font-medium text-slate-900">{template.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Estimated Time:</span>
                        <span className="font-medium text-slate-900">{template.estimatedTime}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-600 mb-2">Frameworks</p>
                      <div className="flex flex-wrap gap-1">
                        {template.frameworks.map((framework, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {framework}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                        Use Template
                      </button>
                      <button className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                        <Eye className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Training & Awareness Tab */}
          {activeTab === 'training' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Security Training & Awareness</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Create Training Module
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainingModules.map((module, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">{module.title}</h3>
                      {module.mandatory && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">
                          Mandatory
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4">{module.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-medium text-slate-900">{module.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Audience:</span>
                        <span className="font-medium text-slate-900">{module.audience}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Last Updated:</span>
                        <span className="font-medium text-slate-900">{module.lastUpdated}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Completion Rate</span>
                        <span className="font-medium text-slate-900">{module.completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${module.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                        View Module
                      </button>
                      <button className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                        <Users className="h-4 w-4 text-slate-600" />
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

export default SecurityPolicies;