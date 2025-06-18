import express from 'express';
import { SecurityController } from '../controllers/SecurityController';

const router = express.Router();
const securityController = new SecurityController();

// Security metrics and dashboard
router.get('/metrics', securityController.getSecurityMetrics);
router.get('/alerts/recent', securityController.getRecentAlerts);
router.post('/scan', securityController.runSecurityScan);
router.get('/score', securityController.getSecurityScore);
router.get('/trends', securityController.getSecurityTrends);

export default router;