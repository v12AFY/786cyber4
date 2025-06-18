import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'User' | 'Auditor';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  mfaEnabled: boolean;
  mfaSecret?: string;
  riskScore: number;
  permissions: string[];
  devices: number;
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: { 
    type: String, 
    required: true,
    enum: ['Admin', 'Manager', 'User', 'Auditor'],
    default: 'User'
  },
  department: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: Date,
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: String,
  riskScore: { type: Number, default: 0, min: 0, max: 100 },
  permissions: [String],
  devices: { type: Number, default: 0 },
  failedLoginAttempts: { type: Number, default: 0 },
  lockoutUntil: Date
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.index({ email: 1 });
UserSchema.index({ department: 1, role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);