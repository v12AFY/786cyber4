import { Server as SocketIOServer } from 'socket.io';
import { Asset } from '../models/Asset';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class AssetDiscoveryService {
  private io?: SocketIOServer;

  constructor(io?: SocketIOServer) {
    this.io = io;
  }

  start() {
    logger.info('🔍 Starting Asset Discovery Service');
    
    // Run asset discovery every hour
    setInterval(() => {
      this.performPassiveDiscovery();
    }, 60 * 60 * 1000);
  }

  async startDiscovery(): Promise<string> {
    const scanId = uuidv4();
    
    logger.info(`Starting asset discovery scan: ${scanId}`);
    
    // Emit scan start event
    this.io?.emit('asset-scan-started', { scanId });
    
    // Simulate discovery process
    setTimeout(async () => {
      try {
        const discoveredAssets = await this.performNetworkScan();
        
        // Save discovered assets
        for (const assetData of discoveredAssets) {
          const existingAsset = await Asset.findOne({ ip: assetData.ip });
          
          if (existingAsset) {
            // Update existing asset
            existingAsset.lastScan = new Date();
            existingAsset.status = 'Online';
            await existingAsset.save();
          } else {
            // Create new asset
            const newAsset = new Asset(assetData);
            await newAsset.save();
            
            // Emit new asset discovered event
            this.io?.emit('asset-discovered', newAsset);
          }
        }
        
        this.io?.emit('asset-scan-completed', { 
          scanId, 
          assetsFound: discoveredAssets.length 
        });
        
        logger.info(`Asset discovery completed: ${scanId}, found ${discoveredAssets.length} assets`);
      } catch (error) {
        logger.error(`Asset discovery failed: ${scanId}`, error);
        this.io?.emit('asset-scan-failed', { scanId, error: error.message });
      }
    }, 15000); // 15 second scan simulation
    
    return scanId;
  }

  private async performNetworkScan(): Promise<any[]> {
    // Simulate network scanning
    const discoveredAssets = [];
    
    for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
      const asset = {
        name: `Device-${String(i + 1).padStart(3, '0')}`,
        type: this.getRandomDeviceType(),
        category: this.getRandomCategory(),
        ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        owner: this.getRandomOwner(),
        department: this.getRandomDepartment(),
        criticality: this.getRandomCriticality(),
        status: 'Online',
        lastScan: new Date(),
        vulnerabilities: Math.floor(Math.random() * 3),
        compliance: [this.getRandomCompliance()],
        tags: ['discovered', 'network-scan']
      };
      
      discoveredAssets.push(asset);
    }
    
    return discoveredAssets;
  }

  private async performPassiveDiscovery() {
    logger.info('Performing passive asset discovery');
    
    // This would implement passive discovery techniques
    // such as monitoring network traffic, DHCP logs, etc.
  }

  private getRandomDeviceType(): string {
    const types = [
      'Windows Server 2022',
      'Windows 11 Pro',
      'Ubuntu 22.04',
      'macOS Ventura',
      'Cisco Router',
      'HP Printer',
      'iPhone',
      'Android Device'
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomCategory(): string {
    const categories = ['Server', 'Workstation', 'Network Device', 'IoT Device', 'Mobile Device'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private getRandomOwner(): string {
    const owners = [
      'IT Department',
      'Finance Department',
      'HR Department',
      'Sales Department',
      'Marketing Department',
      'Operations'
    ];
    return owners[Math.floor(Math.random() * owners.length)];
  }

  private getRandomDepartment(): string {
    const departments = ['IT', 'Finance', 'HR', 'Sales', 'Marketing', 'Operations'];
    return departments[Math.floor(Math.random() * departments.length)];
  }

  private getRandomCriticality(): string {
    const criticalities = ['Low', 'Medium', 'High', 'Critical'];
    const weights = [0.4, 0.3, 0.2, 0.1]; // Weighted towards lower criticality
    
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) {
        return criticalities[i];
      }
    }
    
    return 'Low';
  }

  private getRandomCompliance(): string {
    const frameworks = ['GDPR', 'PCI-DSS', 'HIPAA', 'SOX', 'ISO 27001'];
    return frameworks[Math.floor(Math.random() * frameworks.length)];
  }
}