import express from 'express';

const router = express.Router();

// Mock incident data
const mockIncidents = [
  {
    id: 'INC-2024-001',
    title: 'Ransomware Attack Detected',
    description: 'Suspicious file encryption activity detected on multiple workstations',
    severity: 'Critical',
    status: 'Active',
    assignee: 'John Smith',
    createdAt: '2024-01-15T14:30:22Z',
    updatedAt: '2024-01-15T15:45:12Z',
    category: 'Malware',
    affectedSystems: ['HR-WS-05', 'Finance-WS-12', 'IT-WS-03'],
    priority: 'P1',
    sla: '2 hours',
    timeRemaining: '45 minutes'
  },
  {
    id: 'INC-2024-002',
    title: 'Data Breach Investigation',
    description: 'Unauthorized access to customer database detected',
    severity: 'High',
    status: 'Investigating',
    assignee: 'Sarah Johnson',
    createdAt: '2024-01-15T10:15:33Z',
    updatedAt: '2024-01-15T13:20:45Z',
    category: 'Data Breach',
    affectedSystems: ['DB-Server-01'],
    priority: 'P2',
    sla: '4 hours',
    timeRemaining: '2 hours 15 minutes'
  },
  {
    id: 'INC-2024-003',
    title: 'DDoS Attack Mitigation',
    description: 'Large scale DDoS attack targeting web services',
    severity: 'Medium',
    status: 'Contained',
    assignee: 'Mike Wilson',
    createdAt: '2024-01-15T08:45:11Z',
    updatedAt: '2024-01-15T12:30:22Z',
    category: 'Network Attack',
    affectedSystems: ['Web-Server-01', 'Load-Balancer-01'],
    priority: 'P3',
    sla: '8 hours',
    timeRemaining: 'Within SLA'
  }
];

const mockTeamMembers = [
  {
    name: 'John Smith',
    role: 'Incident Commander',
    status: 'Available',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@company.com',
    activeIncidents: 1,
    expertise: ['Malware Analysis', 'Digital Forensics']
  },
  {
    name: 'Sarah Johnson',
    role: 'Security Analyst',
    status: 'Busy',
    phone: '+1 (555) 234-5678',
    email: 'sarah.johnson@company.com',
    activeIncidents: 2,
    expertise: ['Data Breach Investigation', 'Compliance']
  }
];

const mockPlaybooks = [
  {
    id: 'PB-001',
    title: 'Ransomware Response',
    description: 'Comprehensive playbook for ransomware incident response',
    steps: 8,
    estimatedTime: '2-4 hours',
    lastUpdated: '2024-01-10',
    category: 'Malware',
    difficulty: 'High'
  },
  {
    id: 'PB-002',
    title: 'Data Breach Investigation',
    description: 'Step-by-step data breach investigation and containment',
    steps: 12,
    estimatedTime: '4-8 hours',
    lastUpdated: '2024-01-08',
    category: 'Data Security',
    difficulty: 'High'
  }
];

// Get all incidents
router.get('/', (req, res) => {
  try {
    const { status, severity, assignee } = req.query;
    let filteredIncidents = [...mockIncidents];

    if (status) {
      filteredIncidents = filteredIncidents.filter(incident => 
        incident.status.toLowerCase() === (status as string).toLowerCase()
      );
    }

    if (severity) {
      filteredIncidents = filteredIncidents.filter(incident => 
        incident.severity.toLowerCase() === (severity as string).toLowerCase()
      );
    }

    if (assignee) {
      filteredIncidents = filteredIncidents.filter(incident => 
        incident.assignee.toLowerCase().includes((assignee as string).toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredIncidents,
      total: filteredIncidents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get incident by ID
router.get('/:id', (req, res) => {
  try {
    const incident = mockIncidents.find(inc => inc.id === req.params.id);
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    res.json({
      success: true,
      data: incident
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incident',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new incident
router.post('/', (req, res) => {
  try {
    const { title, description, severity, category, affectedSystems } = req.body;

    if (!title || !description || !severity) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and severity are required'
      });
    }

    const newIncident = {
      id: `INC-2024-${String(mockIncidents.length + 1).padStart(3, '0')}`,
      title,
      description,
      severity,
      status: 'Open',
      assignee: 'Unassigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: category || 'General',
      affectedSystems: affectedSystems || [],
      priority: severity === 'Critical' ? 'P1' : severity === 'High' ? 'P2' : 'P3',
      sla: severity === 'Critical' ? '2 hours' : severity === 'High' ? '4 hours' : '8 hours',
      timeRemaining: 'Just created'
    };

    mockIncidents.push(newIncident);

    res.status(201).json({
      success: true,
      data: newIncident,
      message: 'Incident created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create incident',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update incident
router.put('/:id', (req, res) => {
  try {
    const incidentIndex = mockIncidents.findIndex(inc => inc.id === req.params.id);
    
    if (incidentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    const updatedIncident = {
      ...mockIncidents[incidentIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    mockIncidents[incidentIndex] = updatedIncident;

    res.json({
      success: true,
      data: updatedIncident,
      message: 'Incident updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update incident',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get incident statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      total: mockIncidents.length,
      active: mockIncidents.filter(inc => inc.status === 'Active').length,
      investigating: mockIncidents.filter(inc => inc.status === 'Investigating').length,
      contained: mockIncidents.filter(inc => inc.status === 'Contained').length,
      resolved: mockIncidents.filter(inc => inc.status === 'Resolved').length,
      critical: mockIncidents.filter(inc => inc.severity === 'Critical').length,
      high: mockIncidents.filter(inc => inc.severity === 'High').length,
      medium: mockIncidents.filter(inc => inc.severity === 'Medium').length,
      low: mockIncidents.filter(inc => inc.severity === 'Low').length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incident statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get response team
router.get('/team/members', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockTeamMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get response playbooks
router.get('/playbooks', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockPlaybooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch playbooks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;