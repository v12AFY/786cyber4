import express from 'express';

const router = express.Router();

// Mock compliance frameworks
const mockFrameworks = [
  {
    id: 'nist',
    name: 'NIST Cybersecurity Framework',
    description: 'Comprehensive framework for managing cybersecurity risk',
    progress: 87,
    requirements: 23,
    completed: 20,
    priority: 'High'
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'International standard for information security management',
    progress: 72,
    requirements: 35,
    completed: 25,
    priority: 'Medium'
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    description: 'European data protection regulation',
    progress: 94,
    requirements: 18,
    completed: 17,
    priority: 'High'
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    description: 'Healthcare information privacy and security',
    progress: 45,
    requirements: 22,
    completed: 10,
    priority: 'Low'
  },
  {
    id: 'pci',
    name: 'PCI-DSS',
    description: 'Payment card industry data security standard',
    progress: 65,
    requirements: 12,
    completed: 8,
    priority: 'Medium'
  }
];

const mockComplianceTasks = [
  {
    id: 'TASK-001',
    title: 'Implement Multi-Factor Authentication',
    description: 'Deploy MFA across all user accounts and administrative systems',
    priority: 'High',
    dueDate: '2024-02-15',
    status: 'pending',
    framework: 'NIST CSF',
    estimatedHours: 8,
    assignee: 'IT Team'
  },
  {
    id: 'TASK-002',
    title: 'Update Data Retention Policy',
    description: 'Review and update data retention policies for GDPR compliance',
    priority: 'Medium',
    dueDate: '2024-02-20',
    status: 'in-progress',
    framework: 'GDPR',
    estimatedHours: 4,
    assignee: 'Legal Team'
  },
  {
    id: 'TASK-003',
    title: 'Conduct Security Awareness Training',
    description: 'Complete quarterly security training for all employees',
    priority: 'High',
    dueDate: '2024-02-10',
    status: 'completed',
    framework: 'ISO 27001',
    estimatedHours: 12,
    assignee: 'HR Team'
  }
];

const mockPolicyTemplates = [
  {
    id: 'TEMPLATE-001',
    name: 'Data Protection Policy',
    description: 'GDPR-compliant data handling and privacy policy',
    frameworks: ['GDPR', 'ISO 27001'],
    estimatedTime: '15 minutes',
    category: 'Privacy'
  },
  {
    id: 'TEMPLATE-002',
    name: 'Remote Work Security Policy',
    description: 'Security guidelines for remote and hybrid work environments',
    frameworks: ['NIST CSF', 'ISO 27001'],
    estimatedTime: '10 minutes',
    category: 'Operations'
  },
  {
    id: 'TEMPLATE-003',
    name: 'Incident Response Plan',
    description: 'Structured approach to handling security incidents',
    frameworks: ['NIST CSF', 'ISO 27001'],
    estimatedTime: '20 minutes',
    category: 'Security'
  },
  {
    id: 'TEMPLATE-004',
    name: 'Access Control Policy',
    description: 'User access management and privilege control guidelines',
    frameworks: ['NIST CSF', 'ISO 27001', 'PCI-DSS'],
    estimatedTime: '12 minutes',
    category: 'Access Management'
  }
];

// Get all compliance frameworks
router.get('/frameworks', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockFrameworks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance frameworks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific framework by ID
router.get('/frameworks/:id', (req, res) => {
  try {
    const framework = mockFrameworks.find(f => f.id === req.params.id);
    
    if (!framework) {
      return res.status(404).json({
        success: false,
        message: 'Framework not found'
      });
    }

    res.json({
      success: true,
      data: framework
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch framework',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get compliance tasks
router.get('/tasks', (req, res) => {
  try {
    const { status, priority, framework } = req.query;
    let filteredTasks = [...mockComplianceTasks];

    if (status) {
      filteredTasks = filteredTasks.filter(task => 
        task.status.toLowerCase() === (status as string).toLowerCase()
      );
    }

    if (priority) {
      filteredTasks = filteredTasks.filter(task => 
        task.priority.toLowerCase() === (priority as string).toLowerCase()
      );
    }

    if (framework) {
      filteredTasks = filteredTasks.filter(task => 
        task.framework.toLowerCase().includes((framework as string).toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new compliance task
router.post('/tasks', (req, res) => {
  try {
    const { title, description, priority, dueDate, framework, estimatedHours } = req.body;

    if (!title || !description || !priority || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, priority, and due date are required'
      });
    }

    const newTask = {
      id: `TASK-${String(mockComplianceTasks.length + 1).padStart(3, '0')}`,
      title,
      description,
      priority,
      dueDate,
      status: 'pending',
      framework: framework || 'General',
      estimatedHours: estimatedHours || 0,
      assignee: 'Unassigned'
    };

    mockComplianceTasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Compliance task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create compliance task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update compliance task
router.put('/tasks/:id', (req, res) => {
  try {
    const taskIndex = mockComplianceTasks.findIndex(task => task.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updatedTask = {
      ...mockComplianceTasks[taskIndex],
      ...req.body
    };

    mockComplianceTasks[taskIndex] = updatedTask;

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get policy templates
router.get('/templates', (req, res) => {
  try {
    const { category, framework } = req.query;
    let filteredTemplates = [...mockPolicyTemplates];

    if (category) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    if (framework) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.frameworks.some(f => 
          f.toLowerCase().includes((framework as string).toLowerCase())
        )
      );
    }

    res.json({
      success: true,
      data: filteredTemplates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policy templates',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate policy from template
router.post('/templates/:id/generate', (req, res) => {
  try {
    const template = mockPolicyTemplates.find(t => t.id === req.params.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const { companyName, industry, customizations } = req.body;

    // Mock policy generation
    const generatedPolicy = {
      id: `POLICY-${Date.now()}`,
      name: template.name,
      content: `Generated ${template.name} for ${companyName || 'Your Company'}`,
      template: template.id,
      createdAt: new Date().toISOString(),
      customizations: customizations || {}
    };

    res.json({
      success: true,
      data: generatedPolicy,
      message: 'Policy generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get compliance statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      totalFrameworks: mockFrameworks.length,
      averageProgress: Math.round(
        mockFrameworks.reduce((sum, f) => sum + f.progress, 0) / mockFrameworks.length
      ),
      totalTasks: mockComplianceTasks.length,
      completedTasks: mockComplianceTasks.filter(t => t.status === 'completed').length,
      pendingTasks: mockComplianceTasks.filter(t => t.status === 'pending').length,
      inProgressTasks: mockComplianceTasks.filter(t => t.status === 'in-progress').length,
      highPriorityTasks: mockComplianceTasks.filter(t => t.priority === 'High').length,
      availableTemplates: mockPolicyTemplates.length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;