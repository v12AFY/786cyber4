import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Mock data for system settings
const mockSettings = {
  general: {
    organizationName: 'SecureOps Technologies',
    industry: 'Technology',
    companySize: '51-200 employees',
    timeZone: 'UTC-8 (Pacific Time)',
    darkMode: false,
    autoRefresh: true,
    dataRetention: '1 year'
  },
  security: {
    mfaRequired: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    ipWhitelist: true,
    auditLogging: true
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    slackIntegration: true,
    weeklyReports: true,
    criticalOnly: false,
    reportRecipients: ['ciso@company.com', 'security-team@company.com']
  },
  integrations: [
    {
      id: '1',
      name: 'Microsoft 365',
      type: 'Identity Provider',
      status: 'Connected',
      lastSync: '2024-01-15 10:30',
      users: 156,
      icon: '🏢'
    },
    {
      id: '2',
      name: 'Slack',
      type: 'Notifications',
      status: 'Connected',
      lastSync: '2024-01-15 09:45',
      users: 45,
      icon: '💬'
    },
    {
      id: '3',
      name: 'Splunk',
      type: 'SIEM',
      status: 'Disconnected',
      lastSync: 'Never',
      users: 0,
      icon: '📊'
    },
    {
      id: '4',
      name: 'CrowdStrike',
      type: 'EDR',
      status: 'Connected',
      lastSync: '2024-01-15 11:15',
      users: 134,
      icon: '🛡️'
    }
  ],
  apiKeys: [
    {
      id: '1',
      name: 'Vulnerability Scanner API',
      key: 'sk_live_51H...xyz',
      created: '2024-01-01',
      lastUsed: '2024-01-15',
      permissions: ['read', 'write'],
      status: 'Active'
    },
    {
      id: '2',
      name: 'Threat Intelligence Feed',
      key: 'ti_prod_abc...123',
      created: '2023-12-15',
      lastUsed: '2024-01-14',
      permissions: ['read'],
      status: 'Active'
    },
    {
      id: '3',
      name: 'Backup Service',
      key: 'bk_test_def...456',
      created: '2024-01-10',
      lastUsed: 'Never',
      permissions: ['read', 'write', 'delete'],
      status: 'Inactive'
    }
  ],
  backupSchedules: [
    {
      id: '1',
      name: 'Daily Configuration Backup',
      frequency: 'Daily at 2:00 AM',
      retention: '30 days',
      lastBackup: '2024-01-15 02:00',
      status: 'Success',
      size: '2.3 MB'
    },
    {
      id: '2',
      name: 'Weekly Full System Backup',
      frequency: 'Weekly on Sunday',
      retention: '12 weeks',
      lastBackup: '2024-01-14 03:00',
      status: 'Success',
      size: '156 MB'
    },
    {
      id: '3',
      name: 'Monthly Archive',
      frequency: 'Monthly on 1st',
      retention: '12 months',
      lastBackup: '2024-01-01 04:00',
      status: 'Success',
      size: '1.2 GB'
    }
  ]
};

// Get all system settings
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific settings category
router.get('/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    
    if (!mockSettings[category as keyof typeof mockSettings]) {
      return res.status(404).json({
        success: false,
        message: 'Settings category not found'
      });
    }
    
    res.json({
      success: true,
      data: mockSettings[category as keyof typeof mockSettings]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update general settings
router.put('/general', (req: Request, res: Response) => {
  try {
    const updates = req.body;
    
    // Validate required fields
    if (!updates.organizationName) {
      return res.status(400).json({
        success: false,
        message: 'Organization name is required'
      });
    }
    
    // Update settings (in a real app, this would update the database)
    Object.assign(mockSettings.general, updates);
    
    res.json({
      success: true,
      message: 'General settings updated successfully',
      data: mockSettings.general
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update general settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update security settings
router.put('/security', (req: Request, res: Response) => {
  try {
    const updates = req.body;
    
    // Validate security settings
    if (updates.sessionTimeout && (updates.sessionTimeout < 5 || updates.sessionTimeout > 480)) {
      return res.status(400).json({
        success: false,
        message: 'Session timeout must be between 5 and 480 minutes'
      });
    }
    
    // Update settings
    Object.assign(mockSettings.security, updates);
    
    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: mockSettings.security
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update security settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update notification settings
router.put('/notifications', (req: Request, res: Response) => {
  try {
    const updates = req.body;
    
    // Update settings
    Object.assign(mockSettings.notifications, updates);
    
    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: mockSettings.notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get integrations
router.get('/integrations', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockSettings.integrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch integrations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update integration status
router.put('/integrations/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const integration = mockSettings.integrations.find(i => i.id === id);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integration not found'
      });
    }
    
    integration.status = status;
    if (status === 'Connected') {
      integration.lastSync = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
    
    res.json({
      success: true,
      message: 'Integration updated successfully',
      data: integration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update integration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get API keys
router.get('/api-keys', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockSettings.apiKeys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch API keys',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new API key
router.post('/api-keys', (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;
    
    if (!name || !permissions) {
      return res.status(400).json({
        success: false,
        message: 'Name and permissions are required'
      });
    }
    
    const newApiKey = {
      id: (mockSettings.apiKeys.length + 1).toString(),
      name,
      key: `sk_${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      permissions,
      status: 'Active'
    };
    
    mockSettings.apiKeys.push(newApiKey);
    
    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: newApiKey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create API key',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Revoke API key
router.delete('/api-keys/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const keyIndex = mockSettings.apiKeys.findIndex(k => k.id === id);
    if (keyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }
    
    mockSettings.apiKeys[keyIndex].status = 'Revoked';
    
    res.json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to revoke API key',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get backup schedules
router.get('/backup-schedules', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockSettings.backupSchedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch backup schedules',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Run backup manually
router.post('/backup-schedules/:id/run', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const backup = mockSettings.backupSchedules.find(b => b.id === id);
    if (!backup) {
      return res.status(404).json({
        success: false,
        message: 'Backup schedule not found'
      });
    }
    
    // Simulate backup execution
    backup.lastBackup = new Date().toISOString().slice(0, 16).replace('T', ' ');
    backup.status = 'Success';
    
    res.json({
      success: true,
      message: 'Backup executed successfully',
      data: backup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to execute backup',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;