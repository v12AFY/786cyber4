import { Router } from 'express';

const router = Router();

// Mock vulnerability data
const vulnerabilities = [
  {
    id: 'CVE-2024-0001',
    title: 'Windows RCE Vulnerability',
    description: 'Remote code execution in Windows Print Spooler service',
    severity: 'Critical',
    cvssScore: 9.8,
    affectedAssets: ['DC-Server-01', 'Finance-WS-05', 'HR-WS-12'],
    category: 'Operating System',
    publishedDate: '2024-01-10',
    discoveredDate: '2024-01-12',
    status: 'Open',
    exploitAvailable: true,
    solution: 'Apply Windows Security Update KB5034441'
  },
  {
    id: 'CVE-2023-9876',
    title: 'Apache HTTP Server Buffer Overflow',
    description: 'Buffer overflow vulnerability in Apache HTTP Server',
    severity: 'High',
    cvssScore: 8.1,
    affectedAssets: ['Web-Server-01'],
    category: 'Web Application',
    publishedDate: '2023-12-15',
    discoveredDate: '2024-01-05',
    status: 'In Progress',
    exploitAvailable: false,
    solution: 'Upgrade to Apache HTTP Server 2.4.58'
  },
  {
    id: 'CVE-2023-5432',
    title: 'MySQL Privilege Escalation',
    description: 'Local privilege escalation in MySQL Server',
    severity: 'Medium',
    cvssScore: 6.7,
    affectedAssets: ['DB-Server-01'],
    category: 'Database',
    publishedDate: '2023-11-20',
    discoveredDate: '2024-01-08',
    status: 'Resolved',
    exploitAvailable: false,
    solution: 'Update to MySQL 8.0.35'
  }
];

// Get all vulnerabilities
router.get('/', (req, res) => {
  try {
    const { severity, status, category } = req.query;
    
    let filteredVulns = [...vulnerabilities];
    
    if (severity) {
      filteredVulns = filteredVulns.filter(v => v.severity.toLowerCase() === (severity as string).toLowerCase());
    }
    
    if (status) {
      filteredVulns = filteredVulns.filter(v => v.status.toLowerCase() === (status as string).toLowerCase());
    }
    
    if (category) {
      filteredVulns = filteredVulns.filter(v => v.category.toLowerCase() === (category as string).toLowerCase());
    }
    
    res.json(filteredVulns);
  } catch (error) {
    console.error('Get vulnerabilities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vulnerability by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const vulnerability = vulnerabilities.find(v => v.id === id);
    
    if (!vulnerability) {
      return res.status(404).json({ error: 'Vulnerability not found' });
    }
    
    res.json(vulnerability);
  } catch (error) {
    console.error('Get vulnerability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update vulnerability status
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const vulnerabilityIndex = vulnerabilities.findIndex(v => v.id === id);
    
    if (vulnerabilityIndex === -1) {
      return res.status(404).json({ error: 'Vulnerability not found' });
    }
    
    if (!['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    vulnerabilities[vulnerabilityIndex].status = status;
    
    res.json(vulnerabilities[vulnerabilityIndex]);
  } catch (error) {
    console.error('Update vulnerability status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vulnerability statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = {
      total: vulnerabilities.length,
      critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
      high: vulnerabilities.filter(v => v.severity === 'High').length,
      medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
      low: vulnerabilities.filter(v => v.severity === 'Low').length,
      open: vulnerabilities.filter(v => v.status === 'Open').length,
      inProgress: vulnerabilities.filter(v => v.status === 'In Progress').length,
      resolved: vulnerabilities.filter(v => v.status === 'Resolved').length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get vulnerability stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;