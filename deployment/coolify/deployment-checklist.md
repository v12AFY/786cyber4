# 786 Cyber Platform - Coolify Deployment Checklist

Use this checklist to ensure a successful deployment on your self-hosted Coolify instance.

## Pre-Deployment Checklist

### ✅ Prerequisites
- [ ] Self-hosted Coolify instance is running and accessible
- [ ] Git repository is accessible from Coolify server
- [ ] Supabase project is created and configured
- [ ] Domain names are configured (optional but recommended)
- [ ] SSL certificates are ready (Let's Encrypt or custom)

### ✅ Environment Preparation
- [ ] All environment variables are prepared (use environment-template.env)
- [ ] Supabase URL and keys are copied from project settings
- [ ] JWT secret is generated (minimum 32 characters)
- [ ] SMTP credentials are configured (if using email features)
- [ ] External API keys are obtained (optional)

### ✅ Database Setup
- [ ] Supabase project is active and accessible
- [ ] Database migrations have been run
- [ ] Row Level Security (RLS) policies are enabled
- [ ] Demo data is loaded (optional)
- [ ] Database connection is tested

## Deployment Steps

### Step 1: Deploy Backend Service
- [ ] Create new application in Coolify
- [ ] Connect Git repository
- [ ] Configure build settings:
  - [ ] Build method: Dockerfile
  - [ ] Dockerfile path: `deployment/coolify/backend.dockerfile`
  - [ ] Build context: `backend/`
- [ ] Configure runtime settings:
  - [ ] Port: 3001
  - [ ] Health check path: `/api/health`
- [ ] Add all backend environment variables
- [ ] Deploy and verify health check passes
- [ ] Test API endpoint: `https://your-backend-url/api/health`

### Step 2: Deploy Frontend Service
- [ ] Create second application in Coolify
- [ ] Connect same Git repository
- [ ] Configure build settings:
  - [ ] Build method: Nixpacks (auto-detected)
  - [ ] Build context: root directory
- [ ] Configure runtime settings:
  - [ ] Port: 3000
  - [ ] Health check path: `/health`
- [ ] Add all frontend environment variables
- [ ] Set `VITE_API_URL` to backend's public URL + `/api`
- [ ] Deploy and verify application loads

### Step 3: Configure Domains and SSL
- [ ] Configure custom domain for backend (e.g., api.yourdomain.com)
- [ ] Enable SSL certificate for backend
- [ ] Configure custom domain for frontend (e.g., app.yourdomain.com)
- [ ] Enable SSL certificate for frontend
- [ ] Update `VITE_API_URL` in frontend to use custom domain
- [ ] Redeploy frontend with updated API URL

## Post-Deployment Verification

### ✅ Backend Verification
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Authentication endpoints work: `POST /api/auth/login`
- [ ] Database connection is established
- [ ] Logs show no critical errors
- [ ] CORS is properly configured for frontend domain

### ✅ Frontend Verification
- [ ] Application loads without errors
- [ ] Login page is accessible
- [ ] Demo login works (admin@786cyber.com / demo123)
- [ ] Dashboard loads with demo data
- [ ] API calls to backend succeed
- [ ] No console errors in browser

### ✅ Security Verification
- [ ] HTTPS is enforced on both services
- [ ] Security headers are present
- [ ] Rate limiting is active
- [ ] Environment variables are not exposed in frontend
- [ ] Database access is restricted to application

### ✅ Performance Verification
- [ ] Page load times are acceptable
- [ ] API response times are reasonable
- [ ] Static assets are properly cached
- [ ] Gzip compression is working
- [ ] Health checks are passing consistently

## Troubleshooting Common Issues

### Build Failures
- [ ] Check build logs in Coolify dashboard
- [ ] Verify Dockerfile paths are correct
- [ ] Ensure all dependencies are in package.json
- [ ] Check for syntax errors in configuration files

### Runtime Errors
- [ ] Review application logs
- [ ] Verify all environment variables are set
- [ ] Check database connectivity
- [ ] Ensure ports are correctly configured

### CORS Issues
- [ ] Verify backend CORS configuration includes frontend domain
- [ ] Check that API URLs are correctly set in frontend
- [ ] Ensure protocol (http/https) matches between services

### Database Connection Issues
- [ ] Verify Supabase project is active
- [ ] Check connection strings and credentials
- [ ] Ensure RLS policies allow application access
- [ ] Test database connectivity from backend

## Monitoring and Maintenance

### ✅ Ongoing Monitoring
- [ ] Set up log monitoring and alerts
- [ ] Configure uptime monitoring
- [ ] Monitor resource usage (CPU, memory, disk)
- [ ] Set up backup procedures
- [ ] Plan for security updates

### ✅ Backup Strategy
- [ ] Database backups are automated (Supabase handles this)
- [ ] Application configurations are documented
- [ ] Deployment procedures are documented
- [ ] Recovery procedures are tested

## Support Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Application Logs**: Available in Coolify dashboard
- **Health Checks**: Monitor service status automatically

## Success Criteria

Your deployment is successful when:
- [ ] Both services are running and healthy
- [ ] Frontend application loads and functions correctly
- [ ] Users can log in and access all features
- [ ] API communication between frontend and backend works
- [ ] Security measures are in place and functioning
- [ ] Performance meets acceptable standards

---

**Note**: Keep this checklist updated as you make changes to your deployment configuration. Document any custom modifications or additional steps specific to your environment.