/**
 * Firebase Data Migration Script
 * 
 * This script helps migrate data from Supabase PostgreSQL to Firebase Firestore
 * Run with: node scripts/firebase-data-migrator.js
 */

const { createClient } = require('@supabase/supabase-js');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SUPABASE_SERVICE_KEY';
const FIREBASE_SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require(path.resolve(FIREBASE_SERVICE_ACCOUNT_PATH));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const auth = admin.auth();

class FirebaseMigrator {
  constructor() {
    this.migrationLog = [];
    this.errors = [];
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
    this.migrationLog.push({ timestamp: new Date(), message });
  }

  error(message, error) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
    this.errors.push({ timestamp: new Date(), message, error: error.message });
  }

  async exportSupabaseData() {
    this.log('Starting Supabase data export...');
    
    try {
      // Export tenants
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('*');
      
      if (tenantsError) throw tenantsError;

      // Export tenant_users
      const { data: tenantUsers, error: usersError } = await supabase
        .from('tenant_users')
        .select('*');
      
      if (usersError) throw usersError;

      // Export assets
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('*');
      
      if (assetsError) throw assetsError;

      // Export vulnerabilities
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('vulnerabilities')
        .select('*');
      
      if (vulnError) throw vulnError;

      // Export security_alerts
      const { data: alerts, error: alertsError } = await supabase
        .from('security_alerts')
        .select('*');
      
      if (alertsError) throw alertsError;

      // Export compliance_frameworks
      const { data: compliance, error: complianceError } = await supabase
        .from('compliance_frameworks')
        .select('*');
      
      if (complianceError) throw complianceError;

      // Export incident_reports
      const { data: incidents, error: incidentsError } = await supabase
        .from('incident_reports')
        .select('*');
      
      if (incidentsError) throw incidentsError;

      // Export audit_logs
      const { data: auditLogs, error: auditError } = await supabase
        .from('audit_logs')
        .select('*');
      
      if (auditError) throw auditError;

      const exportData = {
        tenants: tenants || [],
        tenantUsers: tenantUsers || [],
        assets: assets || [],
        vulnerabilities: vulnerabilities || [],
        securityAlerts: alerts || [],
        complianceFrameworks: compliance || [],
        incidentReports: incidents || [],
        auditLogs: auditLogs || []
      };

      // Save to file
      fs.writeFileSync('./supabase-export.json', JSON.stringify(exportData, null, 2));
      this.log(`Exported ${tenants?.length || 0} tenants, ${tenantUsers?.length || 0} users, ${assets?.length || 0} assets`);
      
      return exportData;
    } catch (error) {
      this.error('Failed to export Supabase data', error);
      throw error;
    }
  }

  async migrateUsers(tenantUsers) {
    this.log('Starting user migration...');
    
    for (const user of tenantUsers) {
      try {
        // Create Firebase Auth user
        const userRecord = await auth.createUser({
          uid: user.auth_user_id, // Use original UUID as Firebase UID
          email: user.email,
          displayName: user.full_name,
          emailVerified: true
        });

        this.log(`Created Firebase Auth user: ${user.email}`);
      } catch (error) {
        if (error.code === 'auth/uid-already-exists') {
          this.log(`User ${user.email} already exists in Firebase Auth`);
        } else {
          this.error(`Failed to create user ${user.email}`, error);
        }
      }
    }
  }

  async importToFirestore(data) {
    this.log('Starting Firestore import...');
    
    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500;

    // Helper function to convert PostgreSQL data to Firestore format
    const convertData = (item, tableName) => {
      const converted = { ...item };
      
      // Convert timestamps
      ['created_at', 'updated_at', 'last_login_at', 'last_scan_at', 'published_date', 
       'discovered_date', 'due_date', 'last_assessment_date', 'next_assessment_date', 'resolved_at'].forEach(field => {
        if (converted[field]) {
          converted[field] = admin.firestore.Timestamp.fromDate(new Date(converted[field]));
        }
      });

      // Convert arrays (PostgreSQL arrays to Firestore arrays)
      ['compliance_frameworks', 'asset_tags', 'reference_links', 'affected_assets', 
       'indicators_of_compromise', 'mitre_tactics', 'mitre_techniques', 'response_team',
       'containment_actions', 'recovery_actions', 'evidence_documents'].forEach(field => {
        if (converted[field] && typeof converted[field] === 'string') {
          // Convert PostgreSQL array string to JavaScript array
          converted[field] = converted[field].replace(/[{}]/g, '').split(',').filter(item => item.trim());
        }
      });

      // Convert JSONB fields
      ['settings', 'metadata', 'incident_timeline'].forEach(field => {
        if (converted[field] && typeof converted[field] === 'string') {
          try {
            converted[field] = JSON.parse(converted[field]);
          } catch (e) {
            converted[field] = {};
          }
        }
      });

      // Map field names from PostgreSQL to Firestore
      const fieldMappings = {
        // Tenants
        'subscription_tier': 'subscriptionTier',
        'max_users': 'maxUsers',
        'max_assets': 'maxAssets',
        'created_at': 'createdAt',
        'updated_at': 'updatedAt',
        
        // Tenant Users
        'tenant_id': 'tenantId',
        'auth_user_id': 'authUserId',
        'full_name': 'fullName',
        'user_role': 'userRole',
        'is_active': 'isActive',
        'last_login_at': 'lastLoginAt',
        'mfa_enabled': 'mfaEnabled',
        
        // Assets
        'asset_name': 'assetName',
        'asset_type': 'assetType',
        'ip_address': 'ipAddress',
        'mac_address': 'macAddress',
        'operating_system': 'operatingSystem',
        'os_version': 'osVersion',
        'asset_owner': 'assetOwner',
        'asset_location': 'assetLocation',
        'asset_status': 'assetStatus',
        'last_scan_at': 'lastScanAt',
        'vulnerability_count': 'vulnerabilityCount',
        'compliance_frameworks': 'complianceFrameworks',
        'asset_tags': 'assetTags',
        
        // Vulnerabilities
        'cve_id': 'cveId',
        'vuln_title': 'vulnTitle',
        'vuln_description': 'vulnDescription',
        'cvss_score': 'cvssScore',
        'vuln_category': 'vulnCategory',
        'published_date': 'publishedDate',
        'discovered_date': 'discoveredDate',
        'vuln_status': 'vulnStatus',
        'exploit_available': 'exploitAvailable',
        'reference_links': 'referenceLinks',
        'affected_assets': 'affectedAssets',
        'assigned_to': 'assignedTo',
        'due_date': 'dueDate',
        
        // Security Alerts
        'alert_type': 'alertType',
        'alert_title': 'alertTitle',
        'alert_description': 'alertDescription',
        'alert_source': 'alertSource',
        'alert_status': 'alertStatus',
        'affected_assets': 'affectedAssets',
        'indicators_of_compromise': 'indicatorsOfCompromise',
        'mitre_tactics': 'mitreTactics',
        'mitre_techniques': 'mitreTechniques',
        'assigned_to': 'assignedTo',
        
        // Compliance Frameworks
        'framework_name': 'frameworkName',
        'framework_version': 'frameworkVersion',
        'framework_description': 'frameworkDescription',
        'completion_percentage': 'completionPercentage',
        'current_status': 'currentStatus',
        'requirements_total': 'requirementsTotal',
        'requirements_completed': 'requirementsCompleted',
        'last_assessment_date': 'lastAssessmentDate',
        'next_assessment_date': 'nextAssessmentDate',
        'assigned_to': 'assignedTo',
        'evidence_documents': 'evidenceDocuments',
        
        // Incident Reports
        'incident_number': 'incidentNumber',
        'incident_title': 'incidentTitle',
        'incident_description': 'incidentDescription',
        'incident_status': 'incidentStatus',
        'incident_category': 'incidentCategory',
        'affected_assets': 'affectedAssets',
        'affected_users': 'affectedUsers',
        'assigned_to': 'assignedTo',
        'response_team': 'responseTeam',
        'incident_timeline': 'incidentTimeline',
        'lessons_learned': 'lessonsLearned',
        'estimated_impact': 'estimatedImpact',
        'actual_impact': 'actualImpact',
        'containment_actions': 'containmentActions',
        'recovery_actions': 'recoveryActions',
        'resolved_at': 'resolvedAt',
        
        // Audit Logs
        'user_id': 'userId',
        'audit_action': 'auditAction',
        'resource_type': 'resourceType',
        'resource_id': 'resourceId',
        'old_values': 'oldValues',
        'new_values': 'newValues',
        'ip_address': 'ipAddress',
        'user_agent': 'userAgent'
      };

      // Apply field mappings
      Object.keys(fieldMappings).forEach(oldField => {
        if (converted.hasOwnProperty(oldField)) {
          converted[fieldMappings[oldField]] = converted[oldField];
          delete converted[oldField];
        }
      });

      return converted;
    };

    // Import each collection
    const collections = [
      { name: 'tenants', data: data.tenants },
      { name: 'tenant_users', data: data.tenantUsers },
      { name: 'assets', data: data.assets },
      { name: 'vulnerabilities', data: data.vulnerabilities },
      { name: 'security_alerts', data: data.securityAlerts },
      { name: 'compliance_frameworks', data: data.complianceFrameworks },
      { name: 'incident_reports', data: data.incidentReports },
      { name: 'audit_logs', data: data.auditLogs }
    ];

    for (const collection of collections) {
      this.log(`Importing ${collection.data.length} documents to ${collection.name}...`);
      
      for (const item of collection.data) {
        const convertedItem = convertData(item, collection.name);
        const docRef = db.collection(collection.name).doc(item.id);
        batch.set(docRef, convertedItem);
        
        batchCount++;
        
        // Commit batch when it reaches the limit
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          this.log(`Committed batch of ${batchCount} documents`);
          batchCount = 0;
        }
      }
    }

    // Commit remaining documents
    if (batchCount > 0) {
      await batch.commit();
      this.log(`Committed final batch of ${batchCount} documents`);
    }

    this.log('Firestore import completed');
  }

  async migrate() {
    try {
      this.log('Starting Firebase migration...');
      
      // Step 1: Export data from Supabase
      const data = await this.exportSupabaseData();
      
      // Step 2: Migrate users to Firebase Auth
      await this.migrateUsers(data.tenantUsers);
      
      // Step 3: Import data to Firestore
      await this.importToFirestore(data);
      
      // Step 4: Generate migration report
      const report = {
        completed: true,
        timestamp: new Date(),
        summary: {
          tenants: data.tenants.length,
          users: data.tenantUsers.length,
          assets: data.assets.length,
          vulnerabilities: data.vulnerabilities.length,
          alerts: data.securityAlerts.length,
          compliance: data.complianceFrameworks.length,
          incidents: data.incidentReports.length,
          auditLogs: data.auditLogs.length
        },
        errors: this.errors,
        log: this.migrationLog
      };

      fs.writeFileSync('./migration-report.json', JSON.stringify(report, null, 2));
      
      this.log('Migration completed successfully!');
      this.log(`Migration report saved to migration-report.json`);
      
      if (this.errors.length > 0) {
        this.log(`Migration completed with ${this.errors.length} errors. Check migration-report.json for details.`);
      }
      
    } catch (error) {
      this.error('Migration failed', error);
      throw error;
    }
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  const migrator = new FirebaseMigrator();
  
  migrator.migrate()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = FirebaseMigrator;