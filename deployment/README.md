# 786 Cyber Platform - Production Deployment Guide

This guide covers deploying the multi-tenant cybersecurity platform in production environments.

## Architecture Overview

The platform uses a microservices architecture with:
- **Frontend**: React SPA with Nginx
- **Backend**: Node.js API server
- **Database**: Supabase (PostgreSQL)
- **Cache**: Redis
- **Container Orchestration**: Kubernetes
- **Load Balancer**: AWS ALB / Nginx
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## Multi-Tenant Architecture

### Tenant Isolation
- **Database**: Row-Level Security (RLS) in Supabase
- **Subdomain Routing**: `{tenant}.786cyber.com`
- **Data Separation**: Tenant ID in all database tables
- **Resource Limits**: Per-tenant quotas and rate limiting

### Tenant Onboarding
1. Customer signs up at `786cyber.com`
2. Tenant record created in database
3. Subdomain automatically configured
4. Admin user provisioned
5. Welcome email with setup instructions

## Deployment Options

### Option 1: Docker Compose (Simple)
```bash
# Clone repository
git clone <repository-url>
cd cybersecurity-platform

# Configure environment
cp .env.example .env
# Edit .env with your values

# Deploy
docker-compose -f deployment/docker-compose.prod.yml up -d
```

### Option 2: Kubernetes (Recommended)
```bash
# Setup cluster (AWS EKS)
cd deployment/terraform
terraform init
terraform plan
terraform apply

# Deploy application
cd ../scripts
./deploy.sh v1.0.0
```

### Option 3: Cloud Platforms

#### AWS ECS
- Use provided Terraform configurations
- Automatic scaling and load balancing
- Integrated with AWS services

#### Google Cloud Run
- Serverless container deployment
- Pay-per-use pricing model
- Automatic HTTPS and scaling

#### Azure Container Instances
- Simple container deployment
- Integration with Azure services
- Built-in monitoring

## Environment Configuration

### Required Environment Variables
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Settings
NODE_ENV=production
JWT_SECRET=your-jwt-secret
API_URL=https://api.786cyber.com

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Redis Configuration
REDIS_URL=redis://redis:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### SSL/TLS Configuration
```bash
# Generate wildcard certificate
certbot certonly --dns-cloudflare \
  --dns-cloudflare-credentials ~/.secrets/cloudflare.ini \
  -d 786cyber.com \
  -d *.786cyber.com
```

## Security Considerations

### Network Security
- WAF (Web Application Firewall)
- DDoS protection
- Rate limiting per tenant
- IP whitelisting for admin access

### Data Security
- Encryption at rest and in transit
- Regular security audits
- Vulnerability scanning
- Compliance monitoring (SOC 2, ISO 27001)

### Access Control
- Multi-factor authentication
- Role-based access control (RBAC)
- API key management
- Session management

## Monitoring & Observability

### Metrics
- Application performance (APM)
- Infrastructure metrics
- Business metrics per tenant
- Security metrics

### Logging
- Centralized logging with ELK
- Structured logging format
- Log retention policies
- Security event logging

### Alerting
- Critical system alerts
- Security incident alerts
- Performance degradation alerts
- Tenant-specific alerts

## Scaling Strategy

### Horizontal Scaling
- Kubernetes HPA (Horizontal Pod Autoscaler)
- Database read replicas
- CDN for static assets
- Multi-region deployment

### Vertical Scaling
- Resource limits per tenant
- Database connection pooling
- Redis clustering
- Load balancer optimization

## Backup & Disaster Recovery

### Backup Strategy
```bash
# Automated daily backups
./deployment/scripts/backup.sh

# Backup retention
- Daily: 30 days
- Weekly: 12 weeks  
- Monthly: 12 months
```

### Disaster Recovery
- RTO: 4 hours
- RPO: 1 hour
- Multi-AZ deployment
- Automated failover

## Cost Optimization

### Resource Management
- Right-sizing instances
- Spot instances for non-critical workloads
- Reserved instances for predictable workloads
- Auto-scaling policies

### Tenant Billing
- Usage-based pricing
- Resource quotas per tier
- Billing integration
- Cost allocation tags

## Maintenance

### Updates
- Blue-green deployments
- Rolling updates
- Database migrations
- Security patches

### Health Checks
- Application health endpoints
- Database connectivity
- External service dependencies
- Performance benchmarks

## Support & Documentation

### Runbooks
- Incident response procedures
- Scaling procedures
- Backup/restore procedures
- Security incident response

### Monitoring Dashboards
- System overview
- Tenant metrics
- Security dashboard
- Cost analysis

## Getting Started

1. **Prerequisites**
   - AWS/GCP/Azure account
   - Domain name (786cyber.com)
   - Supabase project
   - Container registry

2. **Initial Setup**
   ```bash
   # Configure DNS
   # Set up SSL certificates
   # Deploy infrastructure
   # Configure monitoring
   ```

3. **First Tenant**
   ```bash
   # Create admin tenant
   # Configure initial settings
   # Test all functionality
   ```

4. **Go Live**
   ```bash
   # Enable customer registration
   # Configure billing
   # Set up support channels
   ```

For detailed setup instructions, see the individual deployment guides in each subdirectory.