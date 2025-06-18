# Cybersecurity Platform Backend API

A comprehensive backend API for SMB cybersecurity management platform built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Real-time Security Monitoring** - Live threat detection and alerting
- **Asset Discovery & Management** - Automated network scanning and asset inventory
- **Vulnerability Management** - CVE tracking and remediation workflows
- **User & Access Management** - Identity governance and risk scoring
- **Compliance Management** - Framework tracking and policy generation
- **Incident Response** - Automated playbooks and team coordination
- **Threat Intelligence** - External feeds and dark web monitoring
- **Reports & Analytics** - Executive dashboards and KPI tracking

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 5.0+
- Redis 6.0+

### Installation

1. Clone and install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Security Dashboard
- `GET /api/security/metrics` - Get security metrics
- `GET /api/security/alerts/recent` - Get recent alerts
- `POST /api/security/scan` - Trigger security scan

### Asset Management
- `GET /api/assets` - List assets
- `POST /api/assets` - Create asset
- `POST /api/assets/scan` - Start asset discovery
- `GET /api/assets/external-surface` - External attack surface

### Vulnerability Management
- `GET /api/vulnerabilities` - List vulnerabilities
- `POST /api/vulnerabilities/scan` - Run vulnerability scan
- `GET /api/vulnerabilities/playbooks` - Get remediation playbooks

### User Management
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/access-risks` - Get access risks

## Real-time Features

The API uses Socket.IO for real-time updates:

- Security alerts
- Asset discovery progress
- Vulnerability scan results
- System metrics updates

## Security Features

- JWT authentication
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration
- Security headers

## Monitoring & Logging

- Winston logging
- Error tracking
- Performance monitoring
- Health checks

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start with PM2:
```bash
pm2 start dist/server.js --name cybersecurity-api
```

3. Set up reverse proxy (nginx):
```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/cybersecurity_platform |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `JWT_SECRET` | JWT signing secret | - |
| `NODE_ENV` | Environment | development |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details