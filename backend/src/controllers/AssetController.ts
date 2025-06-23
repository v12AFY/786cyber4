import { Request, Response } from 'express';
import { assetService } from '../services/supabaseDb';
import { AssetDiscoveryService } from '../services/AssetDiscoveryService';
import { ExternalSurfaceScanner } from '../services/ExternalSurfaceScanner';
import { DarkWebMonitor } from '../services/DarkWebMonitor';
import { logger } from '../utils/logger';

export class AssetController {
  private assetDiscovery = new AssetDiscoveryService();
  private externalScanner = new ExternalSurfaceScanner();
  private darkWebMonitor = new DarkWebMonitor();

  async getAssets(req: Request, res: Response) {
    try {
      const tenantId = req.user?.tenantId || '550e8400-e29b-41d4-a716-446655440001'; // Demo tenant fallback
      
      const { 
        page = 1, 
        limit = 50, 
        category, 
        criticality, 
        status,
        search 
      } = req.query;

      const filters = {
        category: category as string,
        criticality: criticality as string,
        status: status as string,
        search: search as string,
        page: Number(page),
        limit: Number(limit)
      };

      const result = await assetService.getAssets(tenantId, filters);

      return res.json(result);
    } catch (error) {
      logger.error('Error fetching assets:', error);
      return res.status(500).json({ error: 'Failed to fetch assets' });
    }
  }

  async createAsset(req: Request, res: Response) {
    try {
      const tenantId = req.user?.tenantId || '550e8400-e29b-41d4-a716-446655440001'; // Demo tenant fallback
      
      const assetData = {
        ...req.body,
        tenant_id: tenantId
      };
      
      const asset = await assetService.createAsset(assetData);
      
      logger.info(`Asset created: ${asset.asset_name}`);
      return res.status(201).json(asset);
    } catch (error) {
      logger.error('Error creating asset:', error);
      return res.status(400).json({ error: 'Failed to create asset' });
    }
  }

  async getAssetById(req: Request, res: Response) {
    try {
      const tenantId = req.user?.tenantId || '550e8400-e29b-41d4-a716-446655440001'; // Demo tenant fallback
      
      // For now, return a mock asset since we need to implement getAssetById in the service
      const mockAsset = {
        id: req.params.id,
        tenant_id: tenantId,
        asset_name: 'Demo Asset',
        asset_type: 'Server',
        category: 'server',
        ip_address: '192.168.1.100',
        hostname: 'demo-server',
        operating_system: 'Ubuntu 22.04',
        criticality: 'high',
        asset_status: 'online',
        vulnerability_count: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return res.json(mockAsset);
    } catch (error) {
      logger.error('Error fetching asset:', error);
      return res.status(500).json({ error: 'Failed to fetch asset' });
    }
  }

  async updateAsset(req: Request, res: Response) {
    try {
      const asset = await assetService.updateAsset(req.params.id, req.body);
      
      logger.info(`Asset updated: ${asset.asset_name}`);
      return res.json(asset);
    } catch (error) {
      logger.error('Error updating asset:', error);
      return res.status(400).json({ error: 'Failed to update asset' });
    }
  }

  async deleteAsset(req: Request, res: Response) {
    try {
      await assetService.deleteAsset(req.params.id);
      
      logger.info(`Asset deleted: ${req.params.id}`);
      return res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
      logger.error('Error deleting asset:', error);
      return res.status(500).json({ error: 'Failed to delete asset' });
    }
  }

  async scanAssets(req: Request, res: Response) {
    try {
      const scanId = await this.assetDiscovery.startDiscovery();
      
      return res.json({ 
        success: true, 
        scanId,
        message: 'Asset discovery scan initiated' 
      });
    } catch (error) {
      logger.error('Error starting asset scan:', error);
      return res.status(500).json({ error: 'Failed to start asset scan' });
    }
  }

  async getExternalSurface(req: Request, res: Response) {
    try {
      const externalAssets = await this.externalScanner.scanExternalSurface();
      return res.json(externalAssets);
    } catch (error) {
      logger.error('Error fetching external surface:', error);
      return res.status(500).json({ error: 'Failed to fetch external surface data' });
    }
  }

  async getDarkWebAlerts(req: Request, res: Response) {
    try {
      const alerts = await this.darkWebMonitor.getRecentAlerts();
      return res.json(alerts);
    } catch (error) {
      logger.error('Error fetching dark web alerts:', error);
      return res.status(500).json({ error: 'Failed to fetch dark web alerts' });
    }
  }
}