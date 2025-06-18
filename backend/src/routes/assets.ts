import express from 'express';
import { AssetController } from '../controllers/AssetController';

const router = express.Router();
const assetController = new AssetController();

// Asset management
router.get('/', assetController.getAssets);
router.post('/', assetController.createAsset);
router.get('/:id', assetController.getAssetById);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

// Asset discovery and scanning
router.post('/scan', assetController.scanAssets);
router.get('/external-surface', assetController.getExternalSurface);
router.get('/dark-web-alerts', assetController.getDarkWebAlerts);

export default router;