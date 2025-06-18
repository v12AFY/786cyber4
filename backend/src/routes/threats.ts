import { Router } from 'express';

const router = Router();

// Mock threat data
const threats = [
  {
    id: '1',
    title: 'Suspicious PowerShell Activity',
    description: 'Encoded PowerShell command detected on FINANCE-WS-05',
    severity: 'High',
    category: 'Malware',
    source: 'EDR',
    timestamp: '2024-01-15 14:23:45',
    status: 'Active',
    affectedAssets: ['FINANCE-WS-05'],
    iocs: ['powershell.exe', 'base64 encoded command'],
    mitreTactic: 'Execution',
    confidence: 'High'
  },
  {
    id: '2',
    title: 'Brute Force Login Attempt',
    description: 'Multiple failed login attempts from suspicious IP',
    severity: 'Medium',
    category: 'Intrusion Attempt',
    source: 'Firewall',
    timestamp: '2024-01-15 13:45:12',
    status: 'Investigating',
    affectedAssets: ['Web Server'],
    iocs: ['185.220.101.45', 'admin username'],
    mitreTactic: 'Credential Access',
    confidence: 'Medium'
  },
  {
    id: '3',
    title: 'DNS Exfiltration Detected',
    description: 'Unusual DNS queries suggesting data exfiltration',
    severity: 'High',
    category: 'Data Exfiltration',
    source: 'Network Monitor',
    timestamp: '2024-01-15 12:15:33',
    status: 'Contained',
    affectedAssets: ['HR-WS-12'],
    iocs: ['malicious.evil-domain.com', 'DNS tunneling'],
    mitreTactic: 'Exfiltration',
    confidence: 'High'
  },
  {
    id: '4',
    title: 'Phishing Email Campaign',
    description: 'Targeted spear-phishing emails detected',
    severity: 'Medium',
    category: 'Social Engineering',
    source: 'Email Security',
    timestamp: '2024-01-15 10:30:22',
    status: 'Resolved',
    affectedAssets: ['Email System'],
    iocs: ['fake-invoice.pdf', 'spoofed sender'],
    mitreTactic: 'Initial Access',
    confidence: 'High'
  }
];

// Mock threat intelligence data
const threatIntelligence = [
  {
    id: '1',
    type: 'APT Group',
    name: 'APT29 (Cozy Bear)',
    description: 'Increased activity targeting financial sector',
    severity: 'High',
    confidence: 'High',
    lastUpdate: '2024-01-15',
    relevance: 95,
    indicators: ['known_malware_hash', 'c2_domain.com'],
    tactics: ['Initial Access', 'Persistence', 'Exfiltration']
  },
  {
    id: '2',
    type: 'Malware Family',
    name: 'Emotet Variant',
    description: 'New variant bypassing email security',
    severity: 'Medium',
    confidence: 'Medium',
    lastUpdate: '2024-01-14',
    relevance: 78,
    indicators: ['emotet_hash_123', 'malicious_macro.doc'],
    tactics: ['Initial Access', 'Execution']
  }
];

// Get all threats
router.get('/', (req, res) => {
  try {
    const { severity, status, category, timeRange } = req.query;
    
    let filteredThreats = [...threats];
    
    if (severity) {
      filteredThreats = filteredThreats.filter(t => t.severity.toLowerCase() === (severity as string).toLowerCase());
    }
    
    if (status) {
      filteredThreats = filteredThreats.filter(t => t.status.toLowerCase() === (status as string).toLowerCase());
    }
    
    if (category) {
      filteredThreats = filteredThreats.filter(t => t.category.toLowerCase() === (category as string).toLowerCase());
    }
    
    // Simple time filtering (in production, you'd parse dates properly)
    if (timeRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeRange) {
        case '1h':
          filterDate.setHours(now.getHours() - 1);
          break;
        case '24h':
          filterDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          filterDate.setDate(now.getDate() - 30);
          break;
      }
      
      filteredThreats = filteredThreats.filter(t => new Date(t.timestamp) >= filterDate);
    }
    
    res.json(filteredThreats);
  } catch (error) {
    console.error('Get threats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get threat by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const threat = threats.find(t => t.id === id);
    
    if (!threat) {
      return res.status(404).json({ error: 'Threat not found' });
    }
    
    res.json(threat);
  } catch (error) {
    console.error('Get threat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update threat status
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const threatIndex = threats.findIndex(t => t.id === id);
    
    if (threatIndex === -1) {
      return res.status(404).json({ error: 'Threat not found' });
    }
    
    if (!['Active', 'Investigating', 'Contained', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    threats[threatIndex].status = status;
    
    res.json(threats[threatIndex]);
  } catch (error) {
    console.error('Update threat status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get threat statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = {
      total: threats.length,
      active: threats.filter(t => t.status === 'Active').length,
      investigating: threats.filter(t => t.status === 'Investigating').length,
      contained: threats.filter(t => t.status === 'Contained').length,
      resolved: threats.filter(t => t.status === 'Resolved').length,
      bySeverity: {
        critical: threats.filter(t => t.severity === 'Critical').length,
        high: threats.filter(t => t.severity === 'High').length,
        medium: threats.filter(t => t.severity === 'Medium').length,
        low: threats.filter(t => t.severity === 'Low').length
      },
      byCategory: threats.reduce((acc, threat) => {
        acc[threat.category] = (acc[threat.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get threat stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get threat intelligence
router.get('/intelligence/feeds', (req, res) => {
  try {
    res.json(threatIntelligence);
  } catch (error) {
    console.error('Get threat intelligence error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attack vector analysis
router.get('/analysis/vectors', (req, res) => {
  try {
    const vectorAnalysis = {
      emailPhishing: { percentage: 45, count: threats.filter(t => t.category === 'Social Engineering').length },
      maliciousDownloads: { percentage: 28, count: threats.filter(t => t.category === 'Malware').length },
      bruteForce: { percentage: 18, count: threats.filter(t => t.category === 'Intrusion Attempt').length },
      other: { percentage: 9, count: threats.filter(t => !['Social Engineering', 'Malware', 'Intrusion Attempt'].includes(t.category)).length }
    };
    
    res.json(vectorAnalysis);
  } catch (error) {
    console.error('Get attack vector analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;