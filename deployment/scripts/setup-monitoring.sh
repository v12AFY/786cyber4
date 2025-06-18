#!/bin/bash

set -e

echo "📊 Setting up monitoring and observability..."

# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=admin123 \
  --set prometheus.prometheusSpec.retention=30d

# Install Jaeger for tracing
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm install jaeger jaegertracing/jaeger \
  --namespace monitoring

# Install ELK Stack for logging
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch \
  --namespace logging \
  --create-namespace \
  --set replicas=1 \
  --set minimumMasterNodes=1

helm install kibana elastic/kibana \
  --namespace logging

helm install filebeat elastic/filebeat \
  --namespace logging

echo "✅ Monitoring setup completed!"
echo "📊 Grafana: http://localhost:3000 (admin/admin123)"
echo "🔍 Kibana: http://localhost:5601"