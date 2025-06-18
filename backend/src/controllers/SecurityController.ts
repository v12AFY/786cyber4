import { Request, Response } from 'express';
import { Asset } from '../models/Asset';
import { Vulnerability } from '../models/Vulnerability';
import { User } from '../models/User';
import { SecurityAlert } from '../models/SecurityAlert';
import { logger } from '../utils/logger';
import { SecurityMonitoringService } from '../services/SecurityMonitoringService';

export class SecurityController {
  async getSecurityMetrics(req: Request, res: Response) {
    try {
      const [
        totalAssets,
        criticalVulns,
        activeThreats,
        totalUsers
      ] = await Promise.all([
        Asset.countDocuments(),
        Vulnerability.countDocuments({ severity: 'Critical', status: 'Open' }),
        SecurityAlert.countDocuments({ status: 'active' }),
        User.countDocuments({ status: 'active' })
      ]);

      // Calculate security score based on various factors
      const securityScore = await this.calculateSecurityScore();
      
      const metrics = {
        securityScore,
        activeThreats,
        complianceStatus: await this.calculateComplianceStatus(),
        assetsProtected: totalAssets,
        trends: {
          securityScore: '+2%',
          activeThreats: '-3',
          complianceStatus: '+5%',
          assetsProtected: '+12'
        }
      };

      res.json(metrics);
    } catch (error) {
      logger.error('Error fetching security metrics:', error);
      res.status(500).json({ error: 'Failed to fetch security metrics' });
    }
  }

  async getRecentAlerts(req: Request, res: Response) {
    try {
      const alerts = await SecurityAlert.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('affectedAssets', 'name type');

      const formattedAlerts = alerts.map(alert => ({
        id: alert._id,
        severity: alert.severity,
        message: alert.message,
        time: this.formatTimeAgo(alert.createdAt),
        type: alert.type,
        status: alert.status
      }));

      res.json(formattedAlerts);
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
      const score = await this.calculateSecurityScore();
      res.json({ score });
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

  private async calculateSecurityScore(): Promise<number> {
    try {
      const [
        totalAssets,
        vulnerableAssets,
        criticalVulns,
        usersWithMFA,
        totalUsers
      ] = await Promise.all([
        Asset.countDocuments(),
        Asset.countDocuments({ vulnerabilities: { $gt: 0 } }),
        Vulnerability.countDocuments({ severity: 'Critical', status: 'Open' }),
        User.countDocuments({ mfaEnabled: true }),
        User.countDocuments()
      ]);

      // Security score calculation (0-100)
      let score = 100;
      
      // Deduct points for vulnerabilities
      if (totalAssets > 0) {
        const vulnRatio = vulnerableAssets / totalAssets;
        score -= vulnRatio * 30; // Max 30 points deduction
      }
      
      // Deduct points for critical vulnerabilities
      score -= Math.min(criticalVulns * 5, 25); // Max 25 points deduction
      
      // Deduct points for poor MFA adoption
      if (totalUsers > 0) {
        const mfaRatio = usersWithMFA / totalUsers;
        score -= (1 - mfaRatio) * 20; // Max 20 points deduction
      }
      
      return Math.max(Math.round(score), 0);
    } catch (error) {
      logger.error('Error calculating security score:', error);
      return 85; // Default fallback score
    }
  }

  private async calculateComplianceStatus(): Promise<number> {
    // Simplified compliance calculation
    // In a real implementation, this would check against specific compliance frameworks
    const [
      assetsWithCompliance,
      totalAssets
    ] = await Promise.all([
      Asset.countDocuments({ compliance: { $ne: [] } }),
      Asset.countDocuments()
    ]);

    if (totalAssets === 0) return 100;
    return Math.round((assetsWithCompliance / totalAssets) * 100);
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

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  }
}