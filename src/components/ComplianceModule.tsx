import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Settings,
  Clock,
  Users,
  Shield,
  BookOpen,
  Zap
} from 'lucide-react';

const ComplianceModule = () => {
  const [selectedFramework, setSelectedFramework] = useState('nist');
  const [showPolicyGenerator, setShowPolicyGenerator] = useState(false);

  const frameworks = [
    {
      id: 'nist',
      name: 'NIST Cybersecurity Framework',
      description: 'Comprehensive framework for managing cybersecurity risk',
      progress: 87,
      requirements: 23,
      completed: 20,
      priority: 'High'
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      description: 'International standard for information security management',
      progress: 72,
      requirements: 35,
      completed: 25,
      priority: 'Medium'
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'European data protection regulation',
      progress: 94,
      requirements: 18,
      completed: 17,
      priority: 'High'
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      description: 'Healthcare information privacy and security',
      progress: 45,
      requirements: 22,
      completed: 10,
      priority: 'Low'
    },
    {
      id: 'pci',
      name: 'PCI-DSS',
      description: 'Payment card industry data security standard',
      progress: 65,
      requirements: 12,
      completed: 8,
      priority: 'Medium'
    }
  ];

  const selectedFrameworkData = frameworks.find(f => f.id === selectedFramework);

  const complianceTasks = [
    {
      title: 'Implement Multi-Factor Authentication',
      description: 'Deploy MFA across all user accounts and administrative systems',
      priority: 'High',
      dueDate: '2024-02-15',
      status: 'pending',
      framework: 'NIST CSF',
      estimatedHours: 8
    },
    {
      title: 'Update Data Retention Policy',
      description: 'Review and update data retention policies for GDPR compliance',
      priority: 'Medium',
      dueDate: '2024-02-20',
      status: 'in-progress',
      framework: 'GDPR',
      estimatedHours: 4
    },
    {
      title: 'Conduct Security Awareness Training',
      description: 'Complete quarterly security training for all employees',
      priority: 'High',
      dueDate: '2024-02-10',
      status: 'completed',
      framework: 'ISO 27001',
      estimatedHours: 12
    }
  ];

  const policyTemplates = [
    {
      name: 'Data Protection Policy',
      description: 'GDPR-compliant data handling and privacy policy',
      frameworks: ['GDPR', 'ISO 27001'],
      estimatedTime: '15 minutes'
    },
    {
      name: 'Remote Work Security Policy',
      description: 'Security guidelines for remote and hybrid work environments',
      frameworks: ['NIST CSF', 'ISO 27001'],
      estimatedTime: '10 minutes'
    },
    {
      name: 'Incident Response Plan',
      description: 'Structured approach to handling security incidents',
      frameworks: ['NIST CSF', 'ISO 27001'],
      estimatedTime: '20 minutes'
    },
    {
      name: 'Access Control Policy',
      description: 'User access management and privilege control guidelines',
      frameworks: ['NIST CSF', 'ISO 27001', 'PCI-DSS'],
      estimatedTime: '12 minutes'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Compliance Management</h1>
            <p className="text-slate-600 mt-1">
              Smart compliance advisor and policy management system
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowPolicyGenerator(!showPolicyGenerator)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Policy Generator</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Audit Report
            </button>
          </div>
        </div>
      </div>

      {/* Framework Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Compliance Frameworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {frameworks.map((framework) => (
            <div 
              key={framework.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedFramework === framework.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSelectedFramework(framework.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">{framework.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  framework.priority === 'High' ? 'bg-red-100 text-red-700' :
                  framework.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {framework.priority}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{framework.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-medium">{framework.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${framework.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500">
                  {framework.completed} of {framework.requirements} requirements completed
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Framework Details */}
      {selectedFrameworkData && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedFrameworkData.name} Roadmap
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>Export Roadmap</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{selectedFrameworkData.progress}%</p>
              <p className="text-sm text-slate-600">Overall Compliance</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{selectedFrameworkData.completed}</p>
              <p className="text-sm text-slate-600">Requirements Met</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">
                {selectedFrameworkData.requirements - selectedFrameworkData.completed}
              </p>
              <p className="text-sm text-slate-600">Remaining Tasks</p>
            </div>
          </div>
        </div>
      )}

      {/* Policy Generator Modal */}
      {showPolicyGenerator && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">AI Policy Generator</h2>
            <button 
              onClick={() => setShowPolicyGenerator(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policyTemplates.map((template, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{template.name}</h3>
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {template.frameworks.map((framework, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {framework}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{template.estimatedTime}</span>
                </div>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Policy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Priority Tasks</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Tasks
          </button>
        </div>
        <div className="space-y-4">
          {complianceTasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-300'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-slate-900">{task.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span>Due: {task.dueDate}</span>
                  <span>{task.framework}</span>
                  <span>{task.estimatedHours}h estimated</span>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                {task.status === 'completed' ? 'View' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Preparation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Audit Preparation</h2>
            <p className="text-sm text-slate-600">Tools and resources for compliance audits</p>
          </div>
          <BookOpen className="h-6 w-6 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <FileText className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-slate-900">Evidence Collector</h3>
            <p className="text-sm text-slate-600">Automated evidence gathering</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <CheckCircle2 className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-medium text-slate-900">Mock Audit</h3>
            <p className="text-sm text-slate-600">Simulate audit scenarios</p>
          </button>
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Settings className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-slate-900">Gap Analysis</h3>
            <p className="text-sm text-slate-600">Identify compliance gaps</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceModule;