import { useState, useEffect } from 'react';
import { 
  analyticsService, 
  assetService, 
  vulnerabilityService, 
  alertService,
  userService
} from '../services/firebaseDatabase';
import { useAuth } from '../contexts/FirebaseAuthContext';

export const useSecurityMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.tenant?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await analyticsService.getDashboardMetrics(user.tenant.id);
        setMetrics(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching security metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [user?.tenant?.id]);

  return { metrics, loading, error };
};

export const useRecentAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user?.tenant?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await analyticsService.getRecentAlerts(user.tenant.id, 10);
        setAlerts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching recent alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Refresh every 60 seconds
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, [user?.tenant?.id]);

  return { alerts, loading, error };
};

export const useAssets = (filters = {}) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const { user } = useAuth();

  const refreshAssets = async () => {
    if (!user?.tenant?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await assetService.getAssets(user.tenant.id, { 
        ...filters, 
        pageSize: 50 
      });
      setAssets(result.assets);
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAssets();
  }, [user?.tenant?.id, JSON.stringify(filters)]);

  const loadMore = async () => {
    if (!hasMore || !lastDoc || !user?.tenant?.id) return;

    try {
      const result = await assetService.getAssets(user.tenant.id, { 
        ...filters, 
        pageSize: 50,
        lastDoc 
      });
      setAssets(prev => [...prev, ...result.assets]);
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading more assets:', err);
    }
  };

  const scanAssets = async () => {
    try {
      // Simulate asset scanning
      await new Promise(resolve => setTimeout(resolve, 3000));
      await refreshAssets();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createAsset = async (assetData: any) => {
    if (!user?.tenant?.id) {
      return { success: false, error: 'No tenant context' };
    }

    try {
      const newAsset = await assetService.createAsset({
        ...assetData,
        tenantId: user.tenant.id
      });
      await refreshAssets();
      return { success: true, data: newAsset };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateAsset = async (id: string, updates: any) => {
    try {
      const updatedAsset = await assetService.updateAsset(id, updates);
      await refreshAssets();
      return { success: true, data: updatedAsset };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await assetService.deleteAsset(id);
      await refreshAssets();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { 
    assets, 
    loading, 
    error, 
    hasMore,
    refreshAssets, 
    loadMore,
    scanAssets,
    createAsset,
    updateAsset,
    deleteAsset
  };
};

export const useVulnerabilities = (filters = {}) => {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const refreshVulnerabilities = async () => {
    if (!user?.tenant?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await vulnerabilityService.getVulnerabilities(user.tenant.id, filters);
      setVulnerabilities(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching vulnerabilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshVulnerabilities();
  }, [user?.tenant?.id, JSON.stringify(filters)]);

  const createVulnerability = async (vulnData: any) => {
    if (!user?.tenant?.id) {
      return { success: false, error: 'No tenant context' };
    }

    try {
      const newVuln = await vulnerabilityService.createVulnerability({
        ...vulnData,
        tenantId: user.tenant.id
      });
      await refreshVulnerabilities();
      return { success: true, data: newVuln };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateVulnerability = async (id: string, updates: any) => {
    try {
      const updatedVuln = await vulnerabilityService.updateVulnerability(id, updates);
      await refreshVulnerabilities();
      return { success: true, data: updatedVuln };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const runScan = async () => {
    try {
      // Simulate vulnerability scanning
      await new Promise(resolve => setTimeout(resolve, 5000));
      await refreshVulnerabilities();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { 
    vulnerabilities, 
    loading, 
    error, 
    refreshVulnerabilities, 
    createVulnerability,
    updateVulnerability,
    runScan
  };
};

export const useThreatAlerts = (filters = {}) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const refreshAlerts = async () => {
    if (!user?.tenant?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await alertService.getSecurityAlerts(user.tenant.id, filters);
      setAlerts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching threat alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAlerts();
    // Refresh every 30 seconds for real-time monitoring
    const interval = setInterval(refreshAlerts, 30000);
    return () => clearInterval(interval);
  }, [user?.tenant?.id, JSON.stringify(filters)]);

  const acknowledgeAlert = async (id: string) => {
    try {
      await alertService.acknowledgeAlert(id);
      await refreshAlerts();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createAlert = async (alertData: any) => {
    if (!user?.tenant?.id) {
      return { success: false, error: 'No tenant context' };
    }

    try {
      const newAlert = await alertService.createSecurityAlert({
        ...alertData,
        tenantId: user.tenant.id
      });
      await refreshAlerts();
      return { success: true, data: newAlert };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { 
    alerts, 
    loading, 
    error, 
    refreshAlerts,
    acknowledgeAlert,
    createAlert
  };
};