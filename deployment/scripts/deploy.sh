#!/bin/bash

set -e

# Configuration
REGISTRY="your-registry.com"
PROJECT_NAME="786cyber"
VERSION=${1:-latest}

echo "🚀 Starting deployment for 786 Cyber Platform v${VERSION}"

# Build and push Docker images
echo "📦 Building Docker images..."
docker build -t ${REGISTRY}/${PROJECT_NAME}/frontend:${VERSION} -f deployment/Dockerfile.frontend .
docker build -t ${REGISTRY}/${PROJECT_NAME}/backend:${VERSION} -f deployment/Dockerfile.backend ./backend

echo "📤 Pushing images to registry..."
docker push ${REGISTRY}/${PROJECT_NAME}/frontend:${VERSION}
docker push ${REGISTRY}/${PROJECT_NAME}/backend:${VERSION}

# Deploy to Kubernetes
echo "☸️ Deploying to Kubernetes..."
kubectl apply -f deployment/kubernetes/namespace.yaml
kubectl apply -f deployment/kubernetes/configmap.yaml
kubectl apply -f deployment/kubernetes/secrets.yaml
kubectl apply -f deployment/kubernetes/deployment.yaml
kubectl apply -f deployment/kubernetes/service.yaml
kubectl apply -f deployment/kubernetes/ingress.yaml

# Wait for deployment
echo "⏳ Waiting for deployment to complete..."
kubectl rollout status deployment/frontend-deployment -n cybersecurity-platform
kubectl rollout status deployment/backend-deployment -n cybersecurity-platform

echo "✅ Deployment completed successfully!"
echo "🌐 Application available at: https://786cyber.com"