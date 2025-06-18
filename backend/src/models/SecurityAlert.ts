import mongoose, { Document, Schema } from 'mongoose';

export interface ISecurityAlert extends Document {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  description?: string;
  affectedAssets?: string[];
  source?: string;
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SecurityAlertSchema = new Schema<ISecurityAlert>({
  type: { type: String, required: true },
  severity: { 
    type: String, 
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  message: { type: String, required: true },
  description: String,
  affectedAssets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
  source: String,
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active'
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

SecurityAlertSchema.index({ status: 1, severity: 1 });
SecurityAlertSchema.index({ createdAt: -1 });

export const SecurityAlert = mongoose.model<ISecurityAlert>('SecurityAlert', SecurityAlertSchema);