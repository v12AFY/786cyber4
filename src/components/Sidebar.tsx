import React from 'react';
import { 
  Shield, 
  Users, 
  Server, 
  AlertTriangle, 
  FileText, 
  Settings, 
  BarChart3,
  Lock,
  Eye,
  Activity,
  CheckCircle2,
  Bug,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Security Dashboard', icon: Shield },
    { id: 'threats', label: 'Threat Monitor', icon: AlertTriangle },
    { id: 'vulnerabilities', label: 'Vulnerability Mgmt', icon: Bug },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'infrastructure', label: 'Asset Intelligence', icon: Server },
    { id: 'incidents', label: 'Incident Response', icon: MessageSquare },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle2 },
    { id: 'policies', label: 'Security Policies', icon: FileText },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">786 Cyber</h1>
            <p className="text-sm text-slate-400">SMB Security Platform</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium">System Status</span>
        </div>
        <div className="text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Security Score</span>
            <span className="text-green-400">94%</span>
          </div>
          <div className="flex justify-between">
            <span>Active Threats</span>
            <span className="text-yellow-400">7</span>
          </div>
          <div className="flex justify-between">
            <span>Systems Online</span>
            <span className="text-green-400">98%</span>
          </div>
          <div className="flex justify-between">
            <span>Compliance</span>
            <span className="text-blue-400">87%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;