import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { tenantService } from '../services/database';
import type { User } from '@supabase/supabase-js';

interface TenantUser {
  id: string;
  user_id: string;
  tenant_id: string;
  role: 'super_admin' | 'tenant_admin' | 'security_manager' | 'analyst' | 'viewer';
  department: string | null;
  is_active: boolean;
  mfa_enabled: boolean;
  permissions: any;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  subscription_tier: string;
  max_users: number;
  max_assets: number;
  settings: any;
}

interface AuthUser extends User {
  tenantUser?: TenantUser;
  tenant?: Tenant;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
  switchTenant: (tenantId: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  tenantName?: string;
  tenantSlug?: string;
  role?: string;
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserWithTenant(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserWithTenant(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserWithTenant = async (authUser: User) => {
    try {
      setIsLoading(true);
      const tenantData = await tenantService.getCurrentTenant();
      
      const enhancedUser: AuthUser = {
        ...authUser,
        tenantUser: {
          id: tenantData.tenant_id,
          user_id: authUser.id,
          tenant_id: tenantData.tenant_id,
          role: tenantData.role,
          department: null,
          is_active: true,
          mfa_enabled: false,
          permissions: []
        },
        tenant: tenantData.tenants as Tenant
      };
      
      setUser(enhancedUser);
    } catch (error) {
      console.error('Error loading tenant data:', error);
      // If no tenant association exists, user might need to create/join a tenant
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserWithTenant(data.user);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name
          }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user account' };
      }

      // If creating a new tenant
      if (userData.tenantName && userData.tenantSlug) {
        const tenant = await tenantService.createTenant({
          name: userData.tenantName,
          slug: userData.tenantSlug,
          subscription_tier: 'starter'
        });

        // Create tenant user relationship
        await supabase.from('tenant_users').insert({
          user_id: authData.user.id,
          tenant_id: tenant.id,
          role: 'tenant_admin',
          department: userData.department || null,
          is_active: true
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const switchTenant = async (tenantId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // This would switch the user's active tenant context
      // Implementation depends on your multi-tenant strategy
      await loadUserWithTenant(user);
    } catch (error) {
      console.error('Error switching tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    switchTenant,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};