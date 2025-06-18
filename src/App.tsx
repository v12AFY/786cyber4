import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';
import ComplianceModule from './components/ComplianceModule';
import UserManagement from './components/UserManagement';
import AssetIntelligence from './components/AssetIntelligence';
import ThreatMonitor from './components/ThreatMonitor';
import VulnerabilityManagement from './components/VulnerabilityManagement';
import IncidentResponse from './components/IncidentResponse';
import SecurityPolicies from './components/SecurityPolicies';
import ReportsAnalytics from './components/ReportsAnalytics';
import SystemSettings from './components/SystemSettings';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'compliance':
        return <ComplianceModule />;
      case 'users':
        return <UserManagement />;
      case 'infrastructure':
        return <AssetIntelligence />;
      case 'threats':
        return <ThreatMonitor />;
      case 'vulnerabilities':
        return <VulnerabilityManagement />;
      case 'incidents':
        return <IncidentResponse />;
      case 'policies':
        return <SecurityPolicies />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;