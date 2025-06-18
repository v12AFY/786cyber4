import { useState, useEffect } from 'react';
import { 
  analyticsService, 
  assetService, 
  vulnerabilityService, 
  alertService,
  incidentService,
  complianceService 
} from '../services/database';

export const useSecurityMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getDashboardMetrics();
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
  }, []);

  return { metrics, loading, error };
};

export const useRecentAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getRecentAlerts(10);
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
  }, []);

  return { alerts, loading, error };
};

export const useAssets = (filters = {}) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshAssets = async () => {
    try {
      setLoading(true);
      const data = await assetService.getAssets(filters);
      setAssets(data);
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
  }, [JSON.stringify(filters)]);

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
    try {
      const newAsset = await assetService.createAsset(assetData);
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
    refreshAssets, 
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

  const refreshVulnerabilities = async () => {
    try {
      setLoading(true);
      const data = await vulnerabilityService.getVulnerabilities(filters);
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
  }, [JSON.stringify(filters)]);

  const createVulnerability = async (vulnData: any) => {
    try {
      const newVuln = await vulnerabilityService.createVulnerability(vulnData);
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

  const refreshAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertService.getSecurityAlerts(filters);
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
  }, [JSON.stringify(filters)]);

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
    try {
      const newAlert = await alertService.createSecurityAlert(alertData);
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

export const useIncidents = (filters = {}) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentService.getIncidents(filters);
      setIncidents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshIncidents();
  }, [JSON.stringify(filters)]);

  const createIncident = async (incidentData: any) => {
    try {
      const newIncident = await incidentService.createIncident(incidentData);
      await refreshIncidents();
      return { success: true, data: newIncident };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateIncident = async (id: string, updates: any) => {
    try {
      const updatedIncident = await incidentService.updateIncident(id, updates);
      await refreshIncidents();
      return { success: true, data: updatedIncident };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { 
    incidents, 
    loading, 
    error, 
    refreshIncidents,
    createIncident,
    updateIncident
  };
};

export const useCompliance = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshFrameworks = async () => {
    try {
      setLoading(true);
      const data = await complianceService.getComplianceFrameworks();
      setFrameworks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching compliance frameworks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFrameworks();
  }, []);

  const createFramework = async (frameworkData: any) => {
    try {
      const newFramework = await complianceService.createComplianceFramework(frameworkData);
      await refreshFrameworks();
      return { success: true, data: newFramework };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateFramework = async (id: string, updates: any) => {
    try {
      const updatedFramework = await complianceService.updateComplianceFramework(id, updates);
      await refreshFrameworks();
      return { success: true, data: updatedFramework };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { 
    frameworks, 
    loading, 
    error, 
    refreshFrameworks,
    createFramework,
    updateFramework
  };
};