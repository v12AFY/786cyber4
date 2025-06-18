import express from 'express';

const router = express.Router();

// Mock report data
const mockReports = [
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
    popularity: 95,
    status: 'Active'
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
    popularity: 88,
    status: 'Active'
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
    popularity: 92,
    status: 'Active'
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
    popularity: 76,
    status: 'Active'
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
    popularity: 84,
    status: 'Active'
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
    popularity: 71,
    status: 'Active'
  }
];

const mockScheduledReports = [
  {
    id: 'SCHED-001',
    name: 'Weekly Executive Brief',
    reportId: 'RPT-001',
    nextRun: '2024-01-22T09:00:00Z',
    frequency: 'Weekly',
    recipients: 3,
    status: 'Active',
    lastRun: '2024-01-15T09:00:00Z'
  },
  {
    id: 'SCHED-002',
    name: 'Monthly Vulnerability Report',
    reportId: 'RPT-002',
    nextRun: '2024-02-01T08:00:00Z',
    frequency: 'Monthly',
    recipients: 5,
    status: 'Active',
    lastRun: '2024-01-01T08:00:00Z'
  },
  {
    id: 'SCHED-003',
    name: 'Quarterly Compliance Review',
    reportId: 'RPT-003',
    nextRun: '2024-04-01T10:00:00Z',
    frequency: 'Quarterly',
    recipients: 8,
    status: 'Pending',
    lastRun: '2024-01-01T10:00:00Z'
  }
];

const mockKpiMetrics = [
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

// Get all reports
router.get('/', (req, res) => {
  try {
    const { category, frequency, automated } = req.query;
    let filteredReports = [...mockReports];

    if (category) {
      filteredReports = filteredReports.filter(report => 
        report.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    if (frequency) {
      filteredReports = filteredReports.filter(report => 
        report.frequency.toLowerCase() === (frequency as string).toLowerCase()
      );
    }

    if (automated !== undefined) {
      const isAutomated = automated === 'true';
      filteredReports = filteredReports.filter(report => 
        report.automated === isAutomated
      );
    }

    res.json({
      success: true,
      data: filteredReports,
      total: filteredReports.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get report by ID
router.get('/:id', (req, res) => {
  try {
    const report = mockReports.find(r => r.id === req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate report
router.post('/:id/generate', (req, res) => {
  try {
    const report = mockReports.find(r => r.id === req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const { parameters, format } = req.body;

    // Mock report generation
    const generatedReport = {
      id: `GEN-${Date.now()}`,
      reportId: report.id,
      title: report.title,
      generatedAt: new Date().toISOString(),
      format: format || report.format,
      parameters: parameters || {},
      downloadUrl: `/api/reports/download/GEN-${Date.now()}`,
      status: 'completed',
      size: '2.3 MB'
    };

    res.json({
      success: true,
      data: generatedReport,
      message: 'Report generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get scheduled reports
router.get('/scheduled/list', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockScheduledReports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduled reports',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create scheduled report
router.post('/scheduled', (req, res) => {
  try {
    const { name, reportId, frequency, recipients, nextRun } = req.body;

    if (!name || !reportId || !frequency) {
      return res.status(400).json({
        success: false,
        message: 'Name, report ID, and frequency are required'
      });
    }

    const newSchedule = {
      id: `SCHED-${String(mockScheduledReports.length + 1).padStart(3, '0')}`,
      name,
      reportId,
      frequency,
      recipients: recipients || 0,
      status: 'Active',
      nextRun: nextRun || new Date().toISOString(),
      lastRun: null
    };

    mockScheduledReports.push(newSchedule);

    res.status(201).json({
      success: true,
      data: newSchedule,
      message: 'Report scheduled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to schedule report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get KPI metrics
router.get('/analytics/kpis', (req, res) => {
  try {
    const { category, timeRange } = req.query;
    let filteredMetrics = [...mockKpiMetrics];

    if (category) {
      filteredMetrics = filteredMetrics.filter(metric => 
        metric.category.toLowerCase().includes((category as string).toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredMetrics,
      timeRange: timeRange || '30d'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KPI metrics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get report statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      totalReports: mockReports.length,
      automatedReports: mockReports.filter(r => r.automated).length,
      scheduledReports: mockScheduledReports.length,
      activeSchedules: mockScheduledReports.filter(s => s.status === 'Active').length,
      reportsGenerated: 156,
      averagePopularity: Math.round(
        mockReports.reduce((sum, r) => sum + r.popularity, 0) / mockReports.length
      ),
      categories: {
        executive: mockReports.filter(r => r.category === 'Executive').length,
        technical: mockReports.filter(r => r.category === 'Technical').length,
        compliance: mockReports.filter(r => r.category === 'Compliance').length,
        operational: mockReports.filter(r => r.category === 'Operational').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Export data
router.post('/export', (req, res) => {
  try {
    const { type, format, dateRange } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Export type is required'
      });
    }

    // Mock export generation
    const exportFile = {
      id: `EXPORT-${Date.now()}`,
      type,
      format: format || 'CSV',
      dateRange: dateRange || 'last_30_days',
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/reports/download/EXPORT-${Date.now()}`,
      size: '1.2 MB',
      status: 'ready'
    };

    res.json({
      success: true,
      data: exportFile,
      message: 'Export generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate export',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mock download endpoint
router.get('/download/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    
    // In a real implementation, this would serve the actual file
    res.json({
      success: true,
      message: `Download initiated for file: ${fileId}`,
      downloadUrl: `/files/${fileId}.pdf`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;