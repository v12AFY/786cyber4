import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  name: string;
  type: string;
  category: 'Server' | 'Workstation' | 'Network Device' | 'IoT Device' | 'Mobile Device';
  ip: string;
  mac?: string;
  owner: string;
  department: string;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Online' | 'Offline' | 'Unknown';
  operatingSystem?: string;
  version?: string;
  lastScan: Date;
  vulnerabilities: number;
  compliance: string[];
  location?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>({
  name: { type: String, required: true, index: true },
  type: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Server', 'Workstation', 'Network Device', 'IoT Device', 'Mobile Device']
  },
  ip: { type: String, required: true, index: true },
  mac: { type: String, sparse: true },
  owner: { type: String, required: true },
  department: { type: String, required: true },
  criticality: { 
    type: String, 
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  status: { 
    type: String, 
    required: true,
    enum: ['Online', 'Offline', 'Unknown'],
    default: 'Unknown'
  },
  operatingSystem: String,
  version: String,
  lastScan: { type: Date, default: Date.now },
  vulnerabilities: { type: Number, default: 0 },
  compliance: [String],
  location: String,
  tags: [String],
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

AssetSchema.index({ name: 'text', type: 'text', owner: 'text' });

export const Asset = mongoose.model<IAsset>('Asset', AssetSchema);