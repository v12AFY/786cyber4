import { Request, Response } from 'express';
import { analyticsService, securityAlertService } from '../services/supabaseDb';
import { logger } from '../utils/logger';
import { SecurityMonitoringService } from '../services/SecurityMonitoringService';

export class SecurityController {
  async getSecurityMetrics(req: Request, res: Response) {
    try {
      // Get tenant ID from authenticated user context
      const tenantId = req.user?.tenantId || '550e8400-e29b-41d4-a716-446655440001'; // Demo tenant fallback
      
      const metrics = await analyticsService.getDashboardMetrics(tenantId);
      
      res.json(metrics);
    } catch (error) {
      logger.error('Error fetching security metrics:', error);
      res.status(500).json({ error: 'Failed to fetch security metrics' });
    }
  }

  async getRecentAlerts(req: Request, res: Response) {
    try {
      const tenantId = req.user?.tenantId || '550e8400-e29b-41d4-a716-446655440001'; // Demo tenant fallback
      
      const alerts = await analyticsService.getRecentAlerts(tenantId, 10);
      
      res.json(alerts);
    } catch (error) {
      logger.error('Error fetching recent alerts:', error);
      res.status(500).json({ error: 'Failed to fetch recent alerts' });
    }
  }

  async runSecurityScan(req: Request, res: Response) {
    try {
      // Trigger comprehensive security scan
      const scanId = await SecurityMonitoringService.startComprehensiveScan();
      
      res.json({ 
        success: true, 
        scanId,
        message: 'Security scan initiated successfully' 
      });
    } catch (error) {
      logger.error('Error starting security scan:', error);
      res.status(500).json({ error: 'Failed to start security scan' });
    }
  }

  async getSecurityScore(req: Request, res: Response) {
    try {
      const tenantId = req.user?.tenantId || '550e8400-e29b-41d4-a716-446655440001'; // Demo tenant fallback
      
      const metrics = await analyticsService.getDashboardMetrics(tenantId);
      
      res.json({ score: metrics.securityScore });
    } catch (error) {
      logger.error('Error calculating security score:', error);
      res.status(500).json({ error: 'Failed to calculate security score' });
    }
  }

  async getSecurityTrends(req: Request, res: Response) {
    try {
      const { timeRange = '30d' } = req.query;
      
      // Calculate trends based on historical data
      const trends = await this.calculateSecurityTrends(timeRange as string);
      
      res.json(trends);
    } catch (error) {
      logger.error('Error fetching security trends:', error);
      res.status(500).json({ error: 'Failed to fetch security trends' });
    }
  }

  private async calculateSecurityTrends(timeRange: string) {
    // This would implement actual trend calculation based on historical data
    // For now, returning mock trends
    return {
      securityScore: [
        { date: '2024-01-01', value: 92 },
        { date: '2024-01-08', value: 94 },
        { date: '2024-01-15', value: 96 }
      ],
      threats: [
        { date: '2024-01-01', value: 5 },
        { date: '2024-01-08', value: 3 },
        { date: '2024-01-15', value: 2 }
      ]
    };
  }
}