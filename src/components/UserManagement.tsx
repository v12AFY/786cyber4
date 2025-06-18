import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Key,
  UserPlus,
  Settings,
  Search,
  Filter,
  MoreVertical,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const users = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Admin',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-15 09:30',
      mfaEnabled: true,
      riskScore: 'low',
      permissions: ['Full Access', 'User Management', 'System Config'],
      devices: 3
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Manager',
      department: 'Finance',
      status: 'active',
      lastLogin: '2024-01-15 08:45',
      mfaEnabled: true,
      riskScore: 'medium',
      permissions: ['Finance Data', 'Reports', 'Team Management'],
      devices: 2
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      role: 'User',
      department: 'Sales',
      status: 'inactive',
      lastLogin: '2024-01-10 16:20',
      mfaEnabled: false,
      riskScore: 'high',
      permissions: ['CRM Access', 'Customer Data'],
      devices: 1
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'User',
      department: 'Marketing',
      status: 'active',
      lastLogin: '2024-01-15 10:15',
      mfaEnabled: true,
      riskScore: 'low',
      permissions: ['Marketing Tools', 'Analytics'],
      devices: 2
    }
  ];

  const accessRisks = [
    {
      type: 'Excessive Privileges',
      description: 'Users with more permissions than needed for their role',
      count: 3,
      severity: 'medium',
      users: ['mike.wilson@company.com', 'temp.contractor@company.com']
    },
    {
      type: 'Dormant Accounts',
      description: 'Accounts inactive for more than 30 days',
      count: 2,
      severity: 'high',
      users: ['old.employee@company.com']
    },
    {
      type: 'Shared Accounts',
      description: 'Accounts being used by multiple individuals',
      count: 1,
      severity: 'high',
      users: ['shared.service@company.com']
    },
    {
      type: 'Missing MFA',
      description: 'Active users without multi-factor authentication',
      count: 5,
      severity: 'medium',
      users: ['mike.wilson@company.com', 'contractor1@company.com']
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole;
    return matchesSearch && matchesRole;
  });

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-600 mt-1">
              Unified identity hub with access governance and risk management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sync Directory
            </button>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">156</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+12 this month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Users</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">143</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm text-slate-600 mt-2">91.7% active rate</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">MFA Enabled</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">134</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-sm text-purple-600 mt-2">86% coverage</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">High Risk Users</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">8</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-sm text-red-600 mt-2">Requires attention</p>
        </div>
      </div>

      {/* Access Risk Dashboard */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Access Risk Overview</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Full Risk Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accessRisks.map((risk, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">{risk.type}</h3>
                <span className={`w-3 h-3 rounded-full ${
                  risk.severity === 'high' ? 'bg-red-500' :
                  risk.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{risk.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">{risk.count}</span>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Directory */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">User Directory</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Role</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Last Login</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Security</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Risk</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
                      }`}></div>
                      <span className="text-sm capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-600">{user.lastLogin}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {user.mfaEnabled ? (
                        <Shield className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">{user.devices} devices</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.riskScore === 'low' ? 'bg-green-100 text-green-700' :
                      user.riskScore === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {user.riskScore}
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
                      <button className="p-1 hover:bg-slate-200 rounded">
                        <MoreVertical className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-slate-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-700">
              {selectedUsers.length} users selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                <Shield className="h-4 w-4" />
                <span>Enable MFA</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                <Lock className="h-4 w-4" />
                <span>Reset Password</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                <EyeOff className="h-4 w-4" />
                <span>Suspend</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;