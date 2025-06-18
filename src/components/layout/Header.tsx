import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Shield,
  ChevronDown,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const notifications = [
    {
      id: '1',
      title: 'Security Alert',
      message: 'Suspicious login attempt detected',
      time: '2 minutes ago',
      type: 'warning'
    },
    {
      id: '2',
      title: 'System Update',
      message: 'Security patches have been applied',
      time: '1 hour ago',
      type: 'success'
    },
    {
      id: '3',
      title: 'Compliance Report',
      message: 'Monthly compliance report is ready',
      time: '3 hours ago',
      type: 'info'
    }
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search assets, vulnerabilities, users..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-slate-100 hover:bg-slate-50">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{notification.title}</h4>
                          <p className="text-sm text-slate-600">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-200">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600">{user?.role}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-200">
                  <p className="font-medium text-slate-900">{user?.name}</p>
                  <p className="text-sm text-slate-600">{user?.email}</p>
                  <p className="text-xs text-slate-500 mt-1">{user?.department}</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                    <Shield className="h-4 w-4" />
                    <span>Security Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Preferences</span>
                  </button>
                </div>
                <div className="border-t border-slate-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;