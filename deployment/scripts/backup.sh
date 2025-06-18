#!/bin/bash

set -e

BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
S3_BUCKET="786cyber-backups"

echo "💾 Starting backup process..."

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup Supabase (if self-hosted)
echo "📊 Backing up database..."
pg_dump ${DATABASE_URL} > ${BACKUP_DIR}/database.sql

# Backup Redis
echo "🔄 Backing up Redis..."
redis-cli --rdb ${BACKUP_DIR}/redis.rdb

# Backup application configs
echo "⚙️ Backing up configurations..."
kubectl get configmaps -n cybersecurity-platform -o yaml > ${BACKUP_DIR}/configmaps.yaml
kubectl get secrets -n cybersecurity-platform -o yaml > ${BACKUP_DIR}/secrets.yaml

# Compress backup
echo "🗜️ Compressing backup..."
tar -czf ${BACKUP_DIR}.tar.gz -C ${BACKUP_DIR} .

# Upload to S3
echo "☁️ Uploading to S3..."
aws s3 cp ${BACKUP_DIR}.tar.gz s3://${S3_BUCKET}/

# Cleanup local backup
rm -rf ${BACKUP_DIR}
rm ${BACKUP_DIR}.tar.gz

echo "✅ Backup completed successfully!"