import { Request, Response } from 'express';
import { Asset } from '../models/Asset';
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
      const { 
        page = 1, 
        limit = 50, 
        category, 
        criticality, 
        status,
        search 
      } = req.query;

      const filter: any = {};
      
      if (category) filter.category = category;
      if (criticality) filter.criticality = criticality;
      if (status) filter.status = status;
      if (search) {
        filter.$text = { $search: search as string };
      }

      const assets = await Asset.find(filter)
        .limit(Number(limit) * Number(page))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ lastScan: -1 });

      const total = await Asset.countDocuments(filter);

      res.json({
        assets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Error fetching assets:', error);
      res.status(500).json({ error: 'Failed to fetch assets' });
    }
  }

  async createAsset(req: Request, res: Response) {
    try {
      const asset = new Asset(req.body);
      await asset.save();
      
      logger.info(`Asset created: ${asset.name}`);
      res.status(201).json(asset);
    } catch (error) {
      logger.error('Error creating asset:', error);
      res.status(400).json({ error: 'Failed to create asset' });
    }
  }

  async getAssetById(req: Request, res: Response) {
    try {
      const asset = await Asset.findById(req.params.id);
      
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      
      res.json(asset);
    } catch (error) {
      logger.error('Error fetching asset:', error);
      res.status(500).json({ error: 'Failed to fetch asset' });
    }
  }

  async updateAsset(req: Request, res: Response) {
    try {
      const asset = await Asset.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      
      logger.info(`Asset updated: ${asset.name}`);
      res.json(asset);
    } catch (error) {
      logger.error('Error updating asset:', error);
      res.status(400).json({ error: 'Failed to update asset' });
    }
  }

  async deleteAsset(req: Request, res: Response) {
    try {
      const asset = await Asset.findByIdAndDelete(req.params.id);
      
      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }
      
      logger.info(`Asset deleted: ${asset.name}`);
      res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
      logger.error('Error deleting asset:', error);
      res.status(500).json({ error: 'Failed to delete asset' });
    }
  }

  async scanAssets(req: Request, res: Response) {
    try {
      const scanId = await this.assetDiscovery.startDiscovery();
      
      res.json({ 
        success: true, 
        scanId,
        message: 'Asset discovery scan initiated' 
      });
    } catch (error) {
      logger.error('Error starting asset scan:', error);
      res.status(500).json({ error: 'Failed to start asset scan' });
    }
  }

  async getExternalSurface(req: Request, res: Response) {
    try {
      const externalAssets = await this.externalScanner.scanExternalSurface();
      res.json(externalAssets);
    } catch (error) {
      logger.error('Error fetching external surface:', error);
      res.status(500).json({ error: 'Failed to fetch external surface data' });
    }
  }

  async getDarkWebAlerts(req: Request, res: Response) {
    try {
      const alerts = await this.darkWebMonitor.getRecentAlerts();
      res.json(alerts);
    } catch (error) {
      logger.error('Error fetching dark web alerts:', error);
      res.status(500).json({ error: 'Failed to fetch dark web alerts' });
    }
  }
}