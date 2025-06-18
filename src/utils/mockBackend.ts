// Mock backend service to simulate API responses when real backend is not available
export class MockBackendService {
  private static instance: MockBackendService;
  private isOnline = false;

  static getInstance(): MockBackendService {
    if (!MockBackendService.instance) {
      MockBackendService.instance = new MockBackendService();
    }
    return MockBackendService.instance;
  }

  async checkConnection(): Promise<boolean> {
    try {
      // Try to reach the actual API
      const response = await fetch('/api/health', { 
        method: 'GET',
        timeout: 5000 
      } as any);
      this.isOnline = response.ok;
    } catch (error) {
      this.isOnline = false;
    }
    return this.isOnline;
  }

  // Simulate real-time data updates
  generateRealtimeMetrics() {
    return {
      securityScore: Math.floor(Math.random() * 10) + 90, // 90-100
      activeThreats: Math.floor(Math.random() * 5), // 0-5
      complianceStatus: Math.floor(Math.random() * 15) + 85, // 85-100
      assetsProtected: Math.floor(Math.random() * 50) + 150, // 150-200
      trends: {
        securityScore: Math.random() > 0.5 ? '+2%' : '-1%',
        activeThreats: Math.random() > 0.5 ? '-1' : '+2',
        complianceStatus: Math.random() > 0.5 ? '+3%' : '-2%',
        assetsProtected: Math.random() > 0.5 ? '+5' : '+12'
      }
    };
  }

  generateRealtimeAlerts() {
    const alertTypes = [
      'Suspicious login attempt detected',
      'SSL certificate expiring soon',
      'Unusual network traffic detected',
      'Failed authentication attempts',
      'Malware signature detected',
      'Unauthorized access attempt'
    ];

    const severities = ['high', 'medium', 'low'];
    const statuses = ['active', 'acknowledged', 'resolved'];

    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
      id: `alert-${Date.now()}-${i}`,
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      time: `${Math.floor(Math.random() * 60)} minutes ago`,
      type: 'Security',
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  }

  // Simulate vulnerability scanning
  async simulateVulnerabilityScan(): Promise<any[]> {
    // Simulate scan time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return [
      {
        id: `CVE-2024-${Math.floor(Math.random() * 9999)}`,
        title: 'Critical Security Vulnerability Detected',
        description: 'Remote code execution vulnerability in system component',
        severity: 'Critical',
        cvssScore: (Math.random() * 3 + 7).toFixed(1), // 7.0-10.0
        affectedAssets: ['Server-01', 'Workstation-05'],
        category: 'Operating System',
        publishedDate: new Date().toISOString().split('T')[0],
        discoveredDate: new Date().toISOString().split('T')[0],
        status: 'Open',
        exploitAvailable: Math.random() > 0.7,
        solution: 'Apply latest security patches'
      }
    ];
  }

  // Simulate asset discovery
  async simulateAssetDiscovery(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const assetTypes = ['Windows Server', 'Linux Server', 'Windows 11', 'macOS', 'Network Device'];
    const categories = ['Server', 'Workstation', 'Network Device'];
    const owners = ['IT Department', 'Finance Department', 'HR Department', 'Sales Department'];
    const criticalities = ['High', 'Medium', 'Low'];
    
    return Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, i) => ({
      id: `asset-${Date.now()}-${i}`,
      name: `${categories[Math.floor(Math.random() * categories.length)]}-${String(i + 1).padStart(2, '0')}`,
      type: assetTypes[Math.floor(Math.random() * assetTypes.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      owner: owners[Math.floor(Math.random() * owners.length)],
      criticality: criticalities[Math.floor(Math.random() * criticalities.length)],
      status: Math.random() > 0.1 ? 'Online' : 'Offline',
      lastScan: new Date().toISOString(),
      vulnerabilities: Math.floor(Math.random() * 5),
      compliance: Math.random() > 0.5 ? 'GDPR' : 'PCI-DSS'
    }));
  }
}

export const mockBackend = MockBackendService.getInstance();