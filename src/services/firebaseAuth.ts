import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { auth, db, COLLECTIONS, TenantDocument, TenantUserDocument } from '../lib/firebase';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  tenantName?: string;
  tenantSlug?: string;
  role?: string;
  department?: string;
}

export interface AuthUser extends User {
  tenantUser?: TenantUserDocument;
  tenant?: TenantDocument;
}

class FirebaseAuthService {
  private currentUser: AuthUser | null = null;

  /**
   * Initialize auth state listener
   */
  initializeAuthListener(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const enhancedUser = await this.loadUserWithTenant(user);
        this.currentUser = enhancedUser;
        callback(enhancedUser);
      } else {
        this.currentUser = null;
        callback(null);
      }
    });
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const enhancedUser = await this.loadUserWithTenant(userCredential.user);
      this.currentUser = enhancedUser;
      
      // Update last login timestamp
      if (enhancedUser.tenantUser) {
        await this.updateTenantUserLastLogin(enhancedUser.tenantUser.id);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Firebase sign in error:', error);
      return { 
        success: false, 
        error: this.translateFirebaseError(error.code) 
      };
    }
  }

  /**
   * Register new user and create tenant
   */
  async register(userData: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: userData.name
      });

      let tenantId: string;

      // Create tenant if tenant name and slug are provided
      if (userData.tenantName && userData.tenantSlug) {
        // Check if tenant slug already exists
        const existingTenant = await this.checkTenantSlugExists(userData.tenantSlug);
        if (existingTenant) {
          throw new Error('Organization name is already taken. Please choose a different name.');
        }

        // Create new tenant
        const tenant = await this.createTenant({
          name: userData.tenantName,
          slug: userData.tenantSlug,
          subscriptionTier: 'starter',
          maxUsers: 25,
          maxAssets: 250,
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        tenantId = tenant.id;
      } else {
        throw new Error('Tenant information is required for registration');
      }

      // Create tenant user record
      const tenantUser: Omit<TenantUserDocument, 'id'> = {
        tenantId,
        authUserId: user.uid,
        email: userData.email,
        fullName: userData.name,
        userRole: 'tenant_admin',
        department: userData.department || undefined,
        isActive: true,
        mfaEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const tenantUserRef = await addDoc(collection(db, COLLECTIONS.TENANT_USERS), tenantUser);
      
      // Create audit log for user creation
      await this.createAuditLog(tenantId, user.uid, 'CREATE', 'tenant_users', tenantUserRef.id, undefined, tenantUser);

      return { success: true };
    } catch (error: any) {
      console.error('Firebase registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
    this.currentUser = null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  /**
   * Load user with tenant data
   */
  private async loadUserWithTenant(user: User): Promise<AuthUser> {
    try {
      // Find tenant user record
      const tenantUserQuery = query(
        collection(db, COLLECTIONS.TENANT_USERS),
        where('authUserId', '==', user.uid),
        where('isActive', '==', true),
        limit(1)
      );
      
      const tenantUserSnapshot = await getDocs(tenantUserQuery);
      
      if (tenantUserSnapshot.empty) {
        return user as AuthUser;
      }

      const tenantUserDoc = tenantUserSnapshot.docs[0];
      const tenantUserData = { 
        id: tenantUserDoc.id, 
        ...tenantUserDoc.data() 
      } as TenantUserDocument;

      // Get tenant data
      const tenantRef = doc(db, COLLECTIONS.TENANTS, tenantUserData.tenantId);
      const tenantSnapshot = await getDoc(tenantRef);
      
      let tenantData: TenantDocument | undefined;
      if (tenantSnapshot.exists()) {
        tenantData = { 
          id: tenantSnapshot.id, 
          ...tenantSnapshot.data() 
        } as TenantDocument;
      }

      const enhancedUser: AuthUser = {
        ...user,
        tenantUser: tenantUserData,
        tenant: tenantData
      };

      return enhancedUser;
    } catch (error) {
      console.error('Error loading user with tenant:', error);
      return user as AuthUser;
    }
  }

  /**
   * Create a new tenant
   */
  private async createTenant(tenantData: Omit<TenantDocument, 'id'>): Promise<TenantDocument> {
    const tenantRef = await addDoc(collection(db, COLLECTIONS.TENANTS), tenantData);
    return { id: tenantRef.id, ...tenantData };
  }

  /**
   * Check if tenant slug already exists
   */
  private async checkTenantSlugExists(slug: string): Promise<boolean> {
    const tenantQuery = query(
      collection(db, COLLECTIONS.TENANTS),
      where('slug', '==', slug),
      limit(1)
    );
    
    const snapshot = await getDocs(tenantQuery);
    return !snapshot.empty;
  }

  /**
   * Update tenant user last login timestamp
   */
  private async updateTenantUserLastLogin(tenantUserId: string): Promise<void> {
    try {
      const tenantUserRef = doc(db, COLLECTIONS.TENANT_USERS, tenantUserId);
      await setDoc(tenantUserRef, {
        lastLoginAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Create audit log entry
   */
  private async createAuditLog(
    tenantId: string,
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    oldValues?: any,
    newValues?: any
  ): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
        tenantId,
        userId,
        auditAction: action,
        resourceType,
        resourceId,
        oldValues: oldValues || null,
        newValues: newValues || null,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  }

  /**
   * Translate Firebase error codes to user-friendly messages
   */
  private translateFirebaseError(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;