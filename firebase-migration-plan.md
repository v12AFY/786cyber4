# Firebase Migration Plan

This document outlines the complete migration from Supabase to Firebase for the 786 Cyber cybersecurity platform.

## Migration Overview

### 1. Environment Variables Setup

Add these Firebase environment variables to your `.env` file:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication with Email/Password provider
4. Create Firestore database in production mode
5. Get your web app configuration from Project Settings

### 3. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to get user's tenant ID
    function getUserTenantId() {
      return get(/databases/$(database)/documents/tenant_users/$(request.auth.uid)).data.tenantId;
    }
    
    // Helper function to check if user has specific role
    function userHasRole(role) {
      let userData = get(/databases/$(database)/documents/tenant_users/$(request.auth.uid)).data;
      return userData.userRole == role || userData.userRole == 'super_admin' || userData.userRole == 'tenant_admin';
    }
    
    // Tenants collection
    match /tenants/{tenantId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/tenant_users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/tenant_users/$(request.auth.uid)).data.tenantId == tenantId;
      
      allow write: if request.auth != null && userHasRole('tenant_admin');
    }
    
    // Tenant users collection
    match /tenant_users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.authUserId || 
         resource.data.tenantId == getUserTenantId());
      
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.authUserId;
      
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.authUserId || userHasRole('tenant_admin'));
    }
    
    // Assets collection
    match /assets/{assetId} {
      allow read: if request.auth != null && 
        resource.data.tenantId == getUserTenantId();
      
      allow write: if request.auth != null && 
        userHasRole('security_manager');
    }
    
    // Vulnerabilities collection
    match /vulnerabilities/{vulnId} {
      allow read: if request.auth != null && 
        resource.data.tenantId == getUserTenantId();
      
      allow write: if request.auth != null && 
        userHasRole('analyst');
    }
    
    // Security alerts collection
    match /security_alerts/{alertId} {
      allow read: if request.auth != null && 
        resource.data.tenantId == getUserTenantId();
      
      allow write: if request.auth != null && 
        userHasRole('analyst');
    }
    
    // Compliance frameworks collection
    match /compliance_frameworks/{frameworkId} {
      allow read: if request.auth != null && 
        resource.data.tenantId == getUserTenantId();
      
      allow write: if request.auth != null && 
        userHasRole('security_manager');
    }
    
    // Incident reports collection
    match /incident_reports/{incidentId} {
      allow read: if request.auth != null && 
        resource.data.tenantId == getUserTenantId();
      
      allow write: if request.auth != null && 
        userHasRole('analyst');
    }
    
    // Audit logs collection
    match /audit_logs/{logId} {
      allow read: if request.auth != null && 
        resource.data.tenantId == getUserTenantId();
      
      allow create: if request.auth != null;
    }
  }
}
```

### 4. Data Migration Strategy

#### Phase 1: Authentication Migration
1. Export user data from Supabase
2. Use Firebase Admin SDK to create users in Firebase Auth
3. Update tenant_users collection with new Firebase UIDs

#### Phase 2: Data Migration
1. Export all data from Supabase PostgreSQL
2. Transform data to Firestore document structure
3. Import data to Firestore collections

#### Phase 3: Application Migration
1. Update AuthContext to use Firebase
2. Update all database services to use Firestore
3. Test thoroughly with migrated data

### 5. Collection Structure

#### Tenants Collection
```typescript
{
  id: string,
  name: string,
  slug: string,
  domain?: string,
  subscriptionTier: 'starter' | 'professional' | 'enterprise',
  maxUsers: number,
  maxAssets: number,
  settings: object,
  createdAt: Date,
  updatedAt: Date
}
```

#### Tenant Users Collection
```typescript
{
  id: string,
  tenantId: string,
  authUserId: string, // Firebase Auth UID
  email: string,
  fullName: string,
  userRole: 'super_admin' | 'tenant_admin' | 'security_manager' | 'analyst' | 'viewer',
  department?: string,
  isActive: boolean,
  lastLoginAt?: Date,
  mfaEnabled: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Migration Scripts

Create these migration scripts in `scripts/` directory:

1. `export-supabase-data.js` - Export data from Supabase
2. `import-firebase-data.js` - Import data to Firebase
3. `migrate-users.js` - Migrate authentication data
4. `verify-migration.js` - Verify data integrity

### 7. Testing Plan

1. Test authentication flow (login, register, logout)
2. Test data operations (CRUD for all entities)
3. Test security rules (tenant isolation)
4. Test real-time updates
5. Performance testing with sample data

### 8. Deployment Plan

1. Set up Firebase project for production
2. Configure security rules
3. Run data migration scripts
4. Deploy application with Firebase configuration
5. Monitor for issues and rollback plan

### 9. Benefits of Migration

1. **No RLS Issues**: Firebase security rules don't have the timing issues with auth context
2. **Real-time Updates**: Built-in real-time subscriptions
3. **Scalability**: Automatic scaling with usage
4. **Offline Support**: Built-in offline capabilities
5. **Rich Ecosystem**: Integration with other Google Cloud services

### 10. Considerations

1. **Cost**: Firebase pricing based on reads/writes/storage
2. **Query Limitations**: Firestore has some query limitations compared to SQL
3. **Vendor Lock-in**: Moving to Firebase increases dependency on Google ecosystem
4. **Learning Curve**: Team needs to learn Firestore data modeling patterns

### 11. Next Steps

1. Set up Firebase project and get configuration
2. Add environment variables
3. Test authentication with Firebase
4. Gradually migrate components starting with authentication
5. Create data migration scripts
6. Plan production deployment