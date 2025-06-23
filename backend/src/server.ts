import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { connectRedis } from './config/redis';
import { testSupabaseConnection } from './config/supabase';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiterMiddleware } from './middleware/rateLimiter';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import securityRoutes from './routes/security';
import assetRoutes from './routes/assets';
import vulnerabilityRoutes from './routes/vulnerabilities';
import userRoutes from './routes/users';
import threatRoutes from './routes/threats';
import incidentRoutes from './routes/incidents';
import complianceRoutes from './routes/compliance';
import reportRoutes from './routes/reports';
import settingsRoutes from './routes/settings';

// Import services
import { SecurityMonitoringService } from './services/SecurityMonitoringService';
import { VulnerabilityScanner } from './services/VulnerabilityScanner';
import { AssetDiscoveryService } from './services/AssetDiscoveryService';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiterMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'Supabase PostgreSQL'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/security', authMiddleware, securityRoutes);
app.use('/api/assets', authMiddleware, assetRoutes);
app.use('/api/vulnerabilities', authMiddleware, vulnerabilityRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/threats', authMiddleware, threatRoutes);
app.use('/api/incidents', authMiddleware, incidentRoutes);
app.use('/api/compliance', authMiddleware, complianceRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);

// Error handling
app.use(errorHandler);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Initialize services
const securityMonitoring = new SecurityMonitoringService(io);
const vulnerabilityScanner = new VulnerabilityScanner(io);
const assetDiscovery = new AssetDiscoveryService(io);

// Start server
async function startServer() {
  try {
    // Test Supabase connection
    await testSupabaseConnection();
    
    // Connect to Redis
    await connectRedis();
    
    // Start background services
    securityMonitoring.start();
    vulnerabilityScanner.start();
    assetDiscovery.start();
    
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Dashboard: http://localhost:${PORT}/api/health`);
      logger.info(`🗄️ Database: Supabase PostgreSQL`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app, io };