import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { 
  db, 
  COLLECTIONS,
  TenantDocument,
  TenantUserDocument,
  AssetDocument,
  VulnerabilityDocument,
  SecurityAlertDocument,
  ComplianceFrameworkDocument,
  IncidentReportDocument,
  AuditLogDocument
} from '../lib/firebase';

// Helper function to convert Firestore timestamps to JavaScript Dates
const convertTimestamps = (data: any): any => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// Tenant Service
export const tenantService = {
  async getCurrentTenant(userId: string) {
    try {
      // Find tenant user record
      const tenantUserQuery = query(
        collection(db, COLLECTIONS.TENANT_USERS),
        where('authUserId', '==', userId),
        where('isActive', '==', true),
        limit(1)
      );
      
      const tenantUserSnapshot = await getDocs(tenantUserQuery);
      
      if (tenantUserSnapshot.empty) {
        throw new Error('No active tenant association found');
      }

      const tenantUserDoc = tenantUserSnapshot.docs[0];
      const tenantUserData = convertTimestamps({ 
        id: tenantUserDoc.id, 
        ...tenantUserDoc.data() 
      }) as TenantUserDocument;

      // Get tenant data
      const tenantRef = doc(db, COLLECTIONS.TENANTS, tenantUserData.tenantId);
      const tenantSnapshot = await getDoc(tenantRef);
      
      if (!tenantSnapshot.exists()) {
        throw new Error('Tenant not found');
      }

      const tenantData = convertTimestamps({ 
        id: tenantSnapshot.id, 
        ...tenantSnapshot.data() 
      }) as TenantDocument;

      return {
        tenantUser: tenantUserData,
        tenant: tenantData
      };
    } catch (error) {
      console.error('Error getting current tenant:', error);
      throw error;
    }
  },

  async createTenant(tenantData: Omit<TenantDocument, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newTenant = {
        ...tenantData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const tenantRef = await addDoc(collection(db, COLLECTIONS.TENANTS), newTenant);
      return { id: tenantRef.id, ...newTenant };
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  },

  async updateTenant(id: string, updates: Partial<TenantDocument>) {
    try {
      const tenantRef = doc(db, COLLECTIONS.TENANTS, id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(tenantRef, updateData);
      
      const updatedSnapshot = await getDoc(tenantRef);
      return convertTimestamps({ id: updatedSnapshot.id, ...updatedSnapshot.data() });
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  }
};

// User Service
export const userService = {
  async getTenantUsers(tenantId: string) {
    try {
      const usersQuery = query(
        collection(db, COLLECTIONS.TENANT_USERS),
        where('tenantId', '==', tenantId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(usersQuery);
      return snapshot.docs.map(doc => 
        convertTimestamps({ id: doc.id, ...doc.data() })
      ) as TenantUserDocument[];
    } catch (error) {
      console.error('Error getting tenant users:', error);
      throw error;
    }
  },

  async createTenantUser(userData: Omit<TenantUserDocument, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newUser = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const userRef = await addDoc(collection(db, COLLECTIONS.TENANT_USERS), newUser);
      return { id: userRef.id, ...newUser };
    } catch (error) {
      console.error('Error creating tenant user:', error);
      throw error;
    }
  },

  async updateTenantUser(id: string, updates: Partial<TenantUserDocument>) {
    try {
      const userRef = doc(db, COLLECTIONS.TENANT_USERS, id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(userRef, updateData);
      
      const updatedSnapshot = await getDoc(userRef);
      return convertTimestamps({ id: updatedSnapshot.id, ...updatedSnapshot.data() });
    } catch (error) {
      console.error('Error updating tenant user:', error);
      throw error;
    }
  },

  async deactivateUser(id: string) {
    try {
      const userRef = doc(db, COLLECTIONS.TENANT_USERS, id);
      await updateDoc(userRef, {
        isActive: false,
        updatedAt: new Date()
      });
      
      const updatedSnapshot = await getDoc(userRef);
      return convertTimestamps({ id: updatedSnapshot.id, ...updatedSnapshot.data() });
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }
};

// Asset Service
export const assetService = {
  async getAssets(tenantId: string, filters: {
    category?: string;
    criticality?: string;
    status?: string;
    search?: string;
    pageSize?: number;
    lastDoc?: DocumentSnapshot;
  } = {}) {
    try {
      let q = query(
        collection(db, COLLECTIONS.ASSETS),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );

      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.criticality) {
        q = query(q, where('criticality', '==', filters.criticality));
      }
      if (filters.status) {
        q = query(q, where('assetStatus', '==', filters.status));
      }
      
      if (filters.pageSize) {
        q = query(q, limit(filters.pageSize));
      }
      
      if (filters.lastDoc) {
        q = query(q, startAfter(filters.lastDoc));
      }

      const snapshot = await getDocs(q);
      const assets = snapshot.docs.map(doc => 
        convertTimestamps({ id: doc.id, ...doc.data() })
      ) as AssetDocument[];

      // Client-side search filtering (Firestore doesn't support text search)
      let filteredAssets = assets;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredAssets = assets.filter(asset => 
          asset.assetName.toLowerCase().includes(searchTerm) ||
          asset.hostname?.toLowerCase().includes(searchTerm) ||
          asset.ipAddress?.toString().includes(searchTerm)
        );
      }

      return {
        assets: filteredAssets,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === (filters.pageSize || 50)
      };
    } catch (error) {
      console.error('Error getting assets:', error);
      throw error;
    }
  },

  async createAsset(assetData: Omit<AssetDocument, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newAsset = {
        ...assetData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const assetRef = await addDoc(collection(db, COLLECTIONS.ASSETS), newAsset);
      return { id: assetRef.id, ...newAsset };
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  async updateAsset(id: string, updates: Partial<AssetDocument>) {
    try {
      const assetRef = doc(db, COLLECTIONS.ASSETS, id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(assetRef, updateData);
      
      const updatedSnapshot = await getDoc(assetRef);
      return convertTimestamps({ id: updatedSnapshot.id, ...updatedSnapshot.data() });
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  },

  async deleteAsset(id: string) {
    try {
      const assetRef = doc(db, COLLECTIONS.ASSETS, id);
      await deleteDoc(assetRef);
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },

  async getAssetStats(tenantId: string) {
    try {
      const assetsQuery = query(
        collection(db, COLLECTIONS.ASSETS),
        where('tenantId', '==', tenantId)
      );
      
      const snapshot = await getDocs(assetsQuery);
      const assets = snapshot.docs.map(doc => doc.data()) as AssetDocument[];

      const stats = {
        total: assets.length,
        critical: assets.filter(a => a.criticality === 'critical').length,
        high: assets.filter(a => a.criticality === 'high').length,
        online: assets.filter(a => a.assetStatus === 'online').length,
        offline: assets.filter(a => a.assetStatus === 'offline').length,
        totalVulnerabilities: assets.reduce((sum, a) => sum + a.vulnerabilityCount, 0)
      };

      return stats;
    } catch (error) {
      console.error('Error getting asset stats:', error);
      throw error;
    }
  }
};

// Vulnerability Service
export const vulnerabilityService = {
  async getVulnerabilities(tenantId: string, filters: {
    severity?: string;
    status?: string;
    category?: string;
    pageSize?: number;
    lastDoc?: DocumentSnapshot;
  } = {}) {
    try {
      let q = query(
        collection(db, COLLECTIONS.VULNERABILITIES),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );

      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }
      if (filters.status) {
        q = query(q, where('vulnStatus', '==', filters.status));
      }
      if (filters.category) {
        q = query(q, where('vulnCategory', '==', filters.category));
      }
      
      if (filters.pageSize) {
        q = query(q, limit(filters.pageSize));
      }
      
      if (filters.lastDoc) {
        q = query(q, startAfter(filters.lastDoc));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => 
        convertTimestamps({ id: doc.id, ...doc.data() })
      ) as VulnerabilityDocument[];
    } catch (error) {
      console.error('Error getting vulnerabilities:', error);
      throw error;
    }
  },

  async createVulnerability(vulnData: Omit<VulnerabilityDocument, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newVuln = {
        ...vulnData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const vulnRef = await addDoc(collection(db, COLLECTIONS.VULNERABILITIES), newVuln);
      return { id: vulnRef.id, ...newVuln };
    } catch (error) {
      console.error('Error creating vulnerability:', error);
      throw error;
    }
  },

  async updateVulnerability(id: string, updates: Partial<VulnerabilityDocument>) {
    try {
      const vulnRef = doc(db, COLLECTIONS.VULNERABILITIES, id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(vulnRef, updateData);
      
      const updatedSnapshot = await getDoc(vulnRef);
      return convertTimestamps({ id: updatedSnapshot.id, ...updatedSnapshot.data() });
    } catch (error) {
      console.error('Error updating vulnerability:', error);
      throw error;
    }
  },

  async getVulnerabilityStats(tenantId: string) {
    try {
      const vulnQuery = query(
        collection(db, COLLECTIONS.VULNERABILITIES),
        where('tenantId', '==', tenantId)
      );
      
      const snapshot = await getDocs(vulnQuery);
      const vulnerabilities = snapshot.docs.map(doc => doc.data()) as VulnerabilityDocument[];

      const stats = {
        total: vulnerabilities.length,
        critical: vulnerabilities.filter(v => v.severity === 'critical').length,
        high: vulnerabilities.filter(v => v.severity === 'high').length,
        medium: vulnerabilities.filter(v => v.severity === 'medium').length,
        low: vulnerabilities.filter(v => v.severity === 'low').length,
        open: vulnerabilities.filter(v => v.vulnStatus === 'open').length,
        inProgress: vulnerabilities.filter(v => v.vulnStatus === 'in_progress').length,
        resolved: vulnerabilities.filter(v => v.vulnStatus === 'resolved').length
      };

      return stats;
    } catch (error) {
      console.error('Error getting vulnerability stats:', error);
      throw error;
    }
  }
};

// Security Alert Service
export const alertService = {
  async getSecurityAlerts(tenantId: string, filters: {
    severity?: string;
    status?: string;
    alertType?: string;
    pageSize?: number;
    lastDoc?: DocumentSnapshot;
  } = {}) {
    try {
      let q = query(
        collection(db, COLLECTIONS.SECURITY_ALERTS),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );

      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }
      if (filters.status) {
        q = query(q, where('alertStatus', '==', filters.status));
      }
      if (filters.alertType) {
        q = query(q, where('alertType', '==', filters.alertType));
      }
      
      if (filters.pageSize) {
        q = query(q, limit(filters.pageSize));
      }
      
      if (filters.lastDoc) {
        q = query(q, startAfter(filters.lastDoc));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => 
        convertTimestamps({ id: doc.id, ...doc.data() })
      ) as SecurityAlertDocument[];
    } catch (error) {
      console.error('Error getting security alerts:', error);
      throw error;
    }
  },

  async createSecurityAlert(alertData: Omit<SecurityAlertDocument, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newAlert = {
        ...alertData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const alertRef = await addDoc(collection(db, COLLECTIONS.SECURITY_ALERTS), newAlert);
      return { id: alertRef.id, ...newAlert };
    } catch (error) {
      console.error('Error creating security alert:', error);
      throw error;
    }
  },

  async updateSecurityAlert(id: string, updates: Partial<SecurityAlertDocument>) {
    try {
      const alertRef = doc(db, COLLECTIONS.SECURITY_ALERTS, id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(alertRef, updateData);
      
      const updatedSnapshot = await getDoc(alertRef);
      return convertTimestamps({ id: updatedSnapshot.id, ...updatedSnapshot.data() });
    } catch (error) {
      console.error('Error updating security alert:', error);
      throw error;
    }
  },

  async acknowledgeAlert(id: string) {
    try {
      const alertRef = doc(db, COLLECTIONS.SECURITY_ALERTS, id);
      await updateDoc(alertRef, {
        alertStatus: 'investigating',
        updatedAt: new Date()
      });
      
      const updatedSnapshot = await getDoc(alertRef);
      return convertTimestamps({ id: updatedSnapshot.id, ...updatedSnapshot.data() });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }
};

// Analytics Service
export const analyticsService = {
  async getDashboardMetrics(tenantId: string) {
    try {
      const [
        assetStats,
        vulnStats,
        alertsData
      ] = await Promise.all([
        assetService.getAssetStats(tenantId),
        vulnerabilityService.getVulnerabilityStats(tenantId),
        alertService.getSecurityAlerts(tenantId, { status: 'open', pageSize: 100 })
      ]);

      const securityScore = Math.max(0, 100 - (vulnStats.critical * 10) - (vulnStats.high * 5) - (alertsData.length * 2));

      return {
        securityScore,
        activeThreats: alertsData.length,
        complianceStatus: 87, // This would be calculated from compliance frameworks
        assetsProtected: assetStats.total,
        criticalVulnerabilities: vulnStats.critical,
        trends: {
          securityScore: '+2%',
          activeThreats: '-3',
          complianceStatus: '+5%',
          assetsProtected: '+12'
        }
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  },

  async getRecentAlerts(tenantId: string, limitCount = 10) {
    try {
      const alerts = await alertService.getSecurityAlerts(tenantId, { pageSize: limitCount });

      return alerts.map(alert => ({
        id: alert.id,
        severity: alert.severity,
        message: alert.alertTitle,
        time: this.formatTimeAgo(alert.createdAt),
        type: alert.alertType,
        status: alert.alertStatus
      }));
    } catch (error) {
      console.error('Error getting recent alerts:', error);
      throw error;
    }
  },

  formatTimeAgo(date: Date): string {
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
};