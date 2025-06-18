import { Router } from 'express';

const router = Router();

// Mock user data
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
    devices: 3,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-15'
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
    devices: 2,
    createdAt: '2023-02-20',
    updatedAt: '2024-01-15'
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
    devices: 1,
    createdAt: '2023-03-10',
    updatedAt: '2024-01-10'
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
    devices: 2,
    createdAt: '2023-04-05',
    updatedAt: '2024-01-15'
  }
];

// Get all users
router.get('/', (req, res) => {
  try {
    const { role, status, department, riskScore } = req.query;
    
    let filteredUsers = [...users];
    
    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role.toLowerCase() === (role as string).toLowerCase());
    }
    
    if (status) {
      filteredUsers = filteredUsers.filter(u => u.status.toLowerCase() === (status as string).toLowerCase());
    }
    
    if (department) {
      filteredUsers = filteredUsers.filter(u => u.department.toLowerCase() === (department as string).toLowerCase());
    }
    
    if (riskScore) {
      filteredUsers = filteredUsers.filter(u => u.riskScore.toLowerCase() === (riskScore as string).toLowerCase());
    }
    
    res.json(filteredUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/', (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    
    if (!name || !email || !role || !department) {
      return res.status(400).json({ error: 'Name, email, role, and department are required' });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      department,
      status: 'active',
      lastLogin: 'Never',
      mfaEnabled: false,
      riskScore: 'medium',
      permissions: [],
      devices: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    res.json(users[userIndex]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      mfaEnabled: users.filter(u => u.mfaEnabled).length,
      highRisk: users.filter(u => u.riskScore === 'high').length,
      mediumRisk: users.filter(u => u.riskScore === 'medium').length,
      lowRisk: users.filter(u => u.riskScore === 'low').length,
      byRole: {
        admin: users.filter(u => u.role === 'Admin').length,
        manager: users.filter(u => u.role === 'Manager').length,
        user: users.filter(u => u.role === 'User').length
      },
      byDepartment: users.reduce((acc, user) => {
        acc[user.department] = (acc[user.department] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;