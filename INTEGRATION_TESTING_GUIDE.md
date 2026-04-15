# PharmChain Component Integration Testing Guide

## 📋 Overview

This guide ensures all components (Frontend, Backend, AI Service, Blockchain) work together seamlessly when deployed via Docker.

---

## ✅ Pre-Deployment Checklist

- [ ] Docker and Docker Compose installed
- [ ] Project cloned and ready
- [ ] All Dockerfiles in place
- [ ] Environment variables configured (.env.local)
- [ ] Sufficient disk space (~5GB)
- [ ] Sufficient RAM (8GB+ recommended)

---

## 🧪 Phase 1: Individual Service Tests

### 1.1 Backend Service Test

```bash
# Start only backend
docker-compose up backend --build

# In another terminal, test endpoints
curl -v http://localhost:8000/health

# Expected response:
# {"status":"ok","service":"pharmachain-backend"}

# Test AI route (should fail gracefully if AI not running)
curl -X POST http://localhost:8000/verify \
  -H "Content-Type: application/json" \
  -d '{"drug_id":"TEST001"}'

# Check logs for any errors
docker-compose logs backend
```

### 1.2 AI Service Test

```bash
# Start only AI service
docker-compose up ai_service --build

# Test health endpoint
curl http://localhost:8001/health

# Expected response:
# {"status":"ok","classifier_ready":true,"detector_ready":true}

# Test image classification (use a test image)
curl -X POST http://localhost:8001/classify \
  -F "image=@test_image.jpg"

# Expected response structure:
# {"genuine":true,"confidence":0.85,"flags":[],"model":"ResNet50-ImageNet1K"}

# Check model loaded successfully
docker-compose logs ai_service | grep "Classifier loaded"
```

### 1.3 Frontend Service Test

```bash
# Start only frontend
docker-compose up frontend --build

# Test in browser
# http://localhost:5173

# Check console for build errors
docker-compose logs frontend

# Should see: "App running at http://localhost:5173"
```

---

## 🔗 Phase 2: Service-to-Service Communication

### 2.1 Backend → AI Service Communication

```bash
# Start both services
docker-compose up backend ai_service --build

# Wait 30 seconds for health checks to pass

# Check they can reach each other
docker-compose exec backend curl http://ai_service:8001/health
docker-compose exec ai_service curl http://backend:8000/health

# Test actual image classification flow
curl -X POST http://localhost:8000/verify/package \
  -F "image=@test_image.jpg" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Backend should:
# 1. Receive image
# 2. Call AI service at http://ai_service:8001/classify
# 3. Return result to client
```

### 2.2 Frontend → Backend Communication

```bash
# Start all services
docker-compose up --build

# Backend CORS should allow frontend origin
# Check docker-compose.yml: CORS_ORIGINS includes http://frontend:5173

# Test from browser console (http://localhost:5173):
# In browser DevTools console:
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(d => console.log(d))

# Should return health status without CORS error
```

---

## 🔄 Phase 3: Full Integration Test

### 3.1 Start Full Stack

```bash
# Build all services
docker-compose build

# Start everything
docker-compose up -d

# Monitor startup
watch docker-compose ps

# Wait until all show "up (healthy)"
```

### 3.2 Test Complete User Flow

#### 1. Frontend loads and connects to Backend
```bash
# Open browser
curl http://localhost:5173

# Should load React application
```

#### 2. User Authentication (if implemented)
```bash
# Create user or login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@pharmachain.com","password":"password"}'

# Returns access token
```

#### 3. Upload Drug Image for Verification
```bash
# Via Frontend (http://localhost:5173):
# 1. Navigate to Verification page
# 2. Select an image
# 3. Click "Verify"
# 4. Frontend should:
#    - Send image to backend
#    - Backend classifies via AI service
#    - Result displays on frontend

# Via cURL:
curl -X POST http://localhost:8000/verify \
  -F "image=@drug_package.jpg" \
  -H "Authorization: Bearer TOKEN"
```

#### 4. Check Supply Chain Data
```bash
curl http://localhost:8000/supply-chain/shipments

# Should return list of shipments (if any exist)
```

---

## 🐛 Phase 4: Debugging Common Issues

### Issue: Services can't reach each other

```bash
# Check network connectivity
docker-compose exec backend ping ai_service
docker-compose exec frontend curl http://backend:8000/health

# If fails:
# 1. Restart services: docker-compose restart
# 2. Check network: docker network inspect pharmachain_pharmachain-network
# 3. Verify service names in docker-compose.yml
```

### Issue: Frontend gets CORS error

```bash
# Error: Access to XMLHttpRequest blocked by CORS
# Solution:

# 1. Check CORS_ORIGINS in docker-compose.yml
#    Should include: http://frontend:5173

# 2. Check backend CORS middleware setup
docker-compose logs backend | grep -i cors

# 3. Restart backend
docker-compose restart backend
```

### Issue: AI Service returns stub response

```bash
# Response: {"genuine":true,"confidence":0.85,"flags":[],"stub":true}

# Means: Model still loading
# Solution:
# 1. Wait 20-30 seconds for model to load
# 2. Check logs:
docker-compose logs ai_service | tail -20

# Should see: "✅ Classifier loaded: Pre-trained ResNet50"
# 3. Test health endpoint:
curl http://localhost:8001/health
```

### Issue: Port conflicts

```bash
# Error: bind: address already in use
# Solution:

# Find what's using the port (Linux/Mac)
lsof -i :8000
lsof -i :5173
lsof -i :8001

# Kill the process or change port in docker-compose.yml
kill -9 PID

# Or use different ports:
# Change in docker-compose.yml:
# - "9000:8000" (for backend)
```

---

## 📊 Phase 5: Performance Testing

### Memory Usage

```bash
# Check memory consumption
docker stats

# Should see approximately:
# - Backend: 200-500MB
# - AI Service: 1.5-2.5GB (model loaded)
# - Frontend: 200-400MB
# Total: < 4GB during normal operation
```

### Response Times

```bash
# Backend health check
time curl http://localhost:8000/health
# Should be < 100ms

# AI classification (with image)
time curl -X POST http://localhost:8001/classify \
  -F "image=@test.jpg"
# Should be < 2-5 seconds for first request
# < 500ms for subsequent requests (cached)

# Frontend page load
# Browser DevTools: Network tab
# Should load in < 3 seconds
```

### Concurrent Requests

```bash
# Test backend with concurrent requests
ab -n 100 -c 10 http://localhost:8000/health

# Test health endpoints
for i in {1..50}; do curl http://localhost:8000/health & done | wait

# All requests should succeed
```

---

## 🔍 Phase 6: Validation Checklist

Run this final checklist before marking as "ready for production":

```bash
#!/bin/bash

echo "🔍 PharmChain Integration Validation"

# 1. Service Status
echo "✓ Checking service status..."
docker-compose ps | grep "Up (healthy)" | wc -l
# Should output: 3

# 2. Endpoint Health
echo "✓ Testing health endpoints..."
curl -s http://localhost:8000/health | grep "ok"
curl -s http://localhost:8001/health | grep "ok"

# 3. Inter-service communication
echo "✓ Testing inter-service communication..."
docker-compose exec backend curl -s http://ai_service:8001/health | grep "ok"

# 4. CORS Configuration
echo "✓ Checking CORS configuration..."
docker-compose exec backend curl -s http://localhost:8000/health

# 5. Database connectivity
echo "✓ Checking database..."
docker-compose exec backend ls -la /app/data/pharmachain.db

# 6. Ports availability
echo "✓ Checking open ports..."
netstat -tuln | grep -E ":(5173|8000|8001)"

echo "✅ Validation complete!"
```

---

## 📈 Phase 7: Integration Metrics

### Expected Metrics

| Metric | Expected Value | Acceptable | Critical |
|--------|----------------|------------|----------|
| Backend Startup Time | 5-10s | < 15s | > 30s ❌ |
| AI Model Load Time | 15-20s | < 30s | > 45s ❌ |
| Health Check Response | < 100ms | < 500ms | > 1s ❌ |
| Image Classification | 500ms-2s | < 5s | > 10s ❌ |
| Memory Usage | 3-4GB | < 6GB | > 8GB ❌ |
| CPU Usage | 10-30% | < 50% | > 80% ❌ |

### Monitoring Commands

```bash
# Real-time monitoring
watch -n 1 docker stats

# Service event streaming
docker events

# Check for crashes
docker-compose ps --status=exited

# View container logs with timestamps
docker-compose logs --timestamps --tail=100
```

---

## 🚀 Production Readiness Sign-Off

### Before deploying to production, verify:

- [ ] All services pass individual tests
- [ ] Inter-service communication works
- [ ] Full user workflows complete successfully
- [ ] Performance metrics acceptable
- [ ] No errors in logs
- [ ] Health checks pass consistently
- [ ] Database persists across container restarts
- [ ] CORS properly configured
- [ ] Environment variables secure
- [ ] Resource limits appropriate

---

## 📝 Test Results Template

```
Date: YYYY-MM-DD
Tester: [Name]
Status: [PASS/FAIL]

Services Tested:
- Backend: [PASS/FAIL]
- AI Service: [PASS/FAIL]
- Frontend: [PASS/FAIL]
- Integration: [PASS/FAIL]

Issues Found:
1. [Issue]: [Resolution]
2. [Issue]: [Resolution]

Performance Metrics:
- Backend Response Time: __ms
- AI Processing Time: __ms
- Memory Usage: __GB
- CPU Usage: __%

Sign-off:
Signature: ________________
Date: ______________
```

---

**Last Updated**: 2026-04-15  
**Status**: ✅ Ready for testing
