import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate environment variables
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error('Missing Firebase environment variables. Please check your .env file and ensure all VITE_FIREBASE_* variables are set.');
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Database types for TypeScript
export interface TenantDocument {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  maxUsers: number;
  maxAssets: number;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantUserDocument {
  id: string;
  tenantId: string;
  authUserId: string;
  email: string;
  fullName: string;
  userRole: 'super_admin' | 'tenant_admin' | 'security_manager' | 'analyst' | 'viewer';
  department?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetDocument {
  id: string;
  tenantId: string;
  assetName: string;
  assetType: string;
  category: string;
  ipAddress?: string;
  hostname?: string;
  macAddress?: string;
  operatingSystem?: string;
  osVersion?: string;
  department?: string;
  assetOwner?: string;
  assetLocation?: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  assetStatus: 'online' | 'offline' | 'maintenance' | 'unknown';
  lastScanAt?: Date;
  vulnerabilityCount: number;
  complianceFrameworks: string[];
  assetTags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface VulnerabilityDocument {
  id: string;
  tenantId: string;
  cveId?: string;
  vulnTitle: string;
  vulnDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvssScore?: number;
  vulnCategory: string;
  publishedDate?: Date;
  discoveredDate: Date;
  vulnStatus: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  exploitAvailable: boolean;
  solution?: string;
  referenceLinks: string[];
  affectedAssets: string[];
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityAlertDocument {
  id: string;
  tenantId: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  alertTitle: string;
  alertDescription: string;
  alertSource?: string;
  alertStatus: 'open' | 'investigating' | 'contained' | 'resolved';
  affectedAssets: string[];
  indicatorsOfCompromise: string[];
  mitreTactics: string[];
  mitreTechniques: string[];
  assignedTo?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceFrameworkDocument {
  id: string;
  tenantId: string;
  frameworkName: string;
  frameworkVersion?: string;
  frameworkDescription?: string;
  completionPercentage: number;
  currentStatus: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant';
  requirementsTotal: number;
  requirementsCompleted: number;
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  assignedTo?: string;
  evidenceDocuments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentReportDocument {
  id: string;
  tenantId: string;
  incidentNumber: string;
  incidentTitle: string;
  incidentDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  incidentStatus: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  incidentCategory: string;
  affectedAssets: string[];
  affectedUsers: string[];
  assignedTo?: string;
  responseTeam: string[];
  incidentTimeline: Array<{
    timestamp: Date;
    action: string;
    user: string;
    details?: string;
  }>;
  lessonsLearned?: string;
  estimatedImpact?: string;
  actualImpact?: string;
  containmentActions: string[];
  recoveryActions: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface AuditLogDocument {
  id: string;
  tenantId: string;
  userId?: string;
  auditAction: string;
  resourceType: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Firebase collection names
export const COLLECTIONS = {
  TENANTS: 'tenants',
  TENANT_USERS: 'tenant_users',
  ASSETS: 'assets',
  VULNERABILITIES: 'vulnerabilities',
  SECURITY_ALERTS: 'security_alerts',
  COMPLIANCE_FRAMEWORKS: 'compliance_frameworks',
  INCIDENT_REPORTS: 'incident_reports',
  AUDIT_LOGS: 'audit_logs'
} as const;