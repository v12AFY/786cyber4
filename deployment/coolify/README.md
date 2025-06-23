# Coolify Deployment Guide for 786 Cyber Platform

This guide will help you deploy the 786 Cyber cybersecurity platform on your self-hosted Coolify instance.

## Prerequisites

- Self-hosted Coolify instance running and accessible
- Git repository with your project code
- Supabase project set up (or PostgreSQL database)
- SMTP service for email notifications (optional)

## Deployment Overview

The platform consists of two main services:
1. **Backend API** - Node.js/Express server with TypeScript
2. **Frontend** - React SPA built with Vite

## Step 1: Prepare Environment Variables

### Backend Environment Variables

Create these environment variables in Coolify for your backend service:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Database (Supabase)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=24h

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# External APIs (Optional)
VIRUSTOTAL_API_KEY=your-virustotal-api-key
SHODAN_API_KEY=your-shodan-api-key
HAVEIBEENPWNED_API_KEY=your-hibp-api-key

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables

Create these environment variables in Coolify for your frontend service:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration
VITE_API_URL=https://your-backend-domain.com/api

# Environment
NODE_ENV=production
```

## Step 2: Deploy Backend Service

1. **Create New Application in Coolify**
   - Go to your Coolify dashboard
   - Click "New Application"
   - Select "Git Repository"

2. **Configure Repository**
   - Connect your Git repository
   - Select the branch (usually `main` or `master`)
   - Set build context to root directory

3. **Configure Build Settings**
   - Build Method: `Dockerfile`
   - Dockerfile Path: `deployment/Dockerfile.backend`
   - Build Context: `backend/`

4. **Configure Runtime Settings**
   - Port: `3001`
   - Health Check Path: `/api/health`
   - Health Check Port: `3001`

5. **Add Environment Variables**
   - Add all backend environment variables listed above
   - Make sure to replace placeholder values with your actual credentials

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the public URL assigned to your backend

## Step 3: Deploy Frontend Service

1. **Create Second Application in Coolify**
   - Create another new application
   - Connect the same Git repository

2. **Configure Build Settings**
   - Build Method: `Nixpacks` (should auto-detect from nixpacks.toml)
   - Build Context: root directory

3. **Configure Runtime Settings**
   - Port: `3000`
   - Health Check Path: `/`

4. **Add Environment Variables**
   - Add all frontend environment variables listed above
   - Set `VITE_API_URL` to your backend's public URL + `/api`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## Step 4: Configure Domain and SSL

1. **Backend Domain**
   - In Coolify, go to your backend application
   - Configure a custom domain (e.g., `api.yourdomain.com`)
   - Enable SSL certificate

2. **Frontend Domain**
   - Configure a custom domain for frontend (e.g., `app.yourdomain.com`)
   - Enable SSL certificate

3. **Update Frontend Environment**
   - Update `VITE_API_URL` to use your custom backend domain
   - Redeploy frontend service

## Step 5: Verify Deployment

1. **Backend Health Check**
   - Visit `https://your-backend-domain.com/api/health`
   - Should return: `{"status":"OK","timestamp":"...","version":"1.0.0"}`

2. **Frontend Access**
   - Visit your frontend domain
   - Should load the login page
   - Try demo login: `admin@786cyber.com` / `demo123`

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Coolify
   - Ensure all dependencies are properly listed in package.json
   - Verify Dockerfile paths are correct

2. **Environment Variable Issues**
   - Double-check all environment variables are set
   - Ensure no trailing spaces or special characters
   - Verify Supabase URLs and keys are correct

3. **CORS Issues**
   - Ensure backend CORS is configured for your frontend domain
   - Check that API URLs are correctly set in frontend

4. **Database Connection Issues**
   - Verify Supabase project is active
   - Check RLS policies are properly configured
   - Ensure service role key has necessary permissions

### Logs and Monitoring

- Use Coolify's built-in log viewer to monitor application logs
- Set up log retention and monitoring as needed
- Configure alerts for application health

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive environment variables to Git
   - Use strong, unique passwords and secrets
   - Rotate API keys regularly

2. **Network Security**
   - Use HTTPS for all communications
   - Configure proper firewall rules
   - Limit database access to application servers only

3. **Application Security**
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Implement proper backup strategies

## Backup and Recovery

1. **Database Backups**
   - Configure automated Supabase backups
   - Test restore procedures regularly

2. **Application Backups**
   - Use Git for code versioning
   - Document deployment configurations
   - Maintain rollback procedures

## Support

For deployment issues:
1. Check Coolify documentation
2. Review application logs
3. Verify environment configuration
4. Test individual components

The platform includes comprehensive error handling and fallback mechanisms to ensure reliability in production environments.