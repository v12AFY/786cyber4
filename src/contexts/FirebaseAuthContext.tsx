import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import firebaseAuthService, { AuthUser, RegisterData } from '../services/firebaseAuth';
import { TenantUserDocument, TenantDocument } from '../lib/firebase';

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

export const FirebaseAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase auth state listener
    const unsubscribe = firebaseAuthService.initializeAuthListener((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await firebaseAuthService.signIn(email, password);
      if (result.success) {
        const currentUser = firebaseAuthService.getCurrentUser();
        setUser(currentUser);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await firebaseAuthService.register(userData);
      if (result.success) {
        const currentUser = firebaseAuthService.getCurrentUser();
        setUser(currentUser);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await firebaseAuthService.signOut();
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
      // This would implement tenant switching logic
      // For now, reload user data
      const currentUser = firebaseAuthService.getCurrentUser();
      setUser(currentUser);
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