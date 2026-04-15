# PharmChain Docker Deployment Guide

## 📋 Prerequisites

- Docker Desktop (or Docker Engine) installed
- Docker Compose v2.0+
- At least 8GB RAM available
- ~5GB disk space for images and data

### Installation Commands

```bash
# macOS (Homebrew)
brew install docker docker-compose

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Verify installation
docker --version
docker-compose --version
```

---

## 🚀 Quick Start (Development Mode)

### 1. **Prepare Environment**

```bash
# Navigate to project root
cd /path/to/PharmChain

# Copy environment template
cp .env.local .env.local  # Already done - check file exists

# Optional: Adjust .env.local for your setup
nano .env.local
```

### 2. **Build All Services**

```bash
# Build all containers (may take 5-10 minutes on first build)
docker-compose build

# Output should show:
# ✅ Successfully built pharmachain-ai
# ✅ Successfully built pharmachain-backend
# ✅ Successfully built pharmachain-frontend
```

### 3. **Start Services**

```bash
# Start all services in foreground (good for debugging)
docker-compose up

# OR start in background mode
docker-compose up -d

# To see logs
docker-compose logs -f

# To see logs from specific service
docker-compose logs -f backend
docker-compose logs -f ai_service
docker-compose logs -f frontend
```

### 4. **Access Applications**

Once services are running:

| Service | URL | Health Check |
|---------|-----|--------------|
| **Frontend** | http://localhost:5173 | ✅ Should load React app |
| **Backend API** | http://localhost:8000 | GET http://localhost:8000/health |
| **AI Service** | http://localhost:8001 | GET http://localhost:8001/health |
| **API Docs** | http://localhost:8000/docs | Swagger UI |

Test Backend:
```bash
curl http://localhost:8000/health
# Expected response: {"status":"ok","service":"pharmachain-backend"}

curl http://localhost:8001/health
# Expected response: {"status":"ok","classifier_ready":true,"detector_ready":true}
```

---

## 🔧 Service Configuration Details

### AI Service
- **Port**: 8001
- **Model**: Pre-trained ResNet50 (ImageNet1K)
- **Features**:
  - ✅ Image Classification (no training needed!)
  - ✅ Health checks every 30s
  - ✅ CPU optimized (2GB peak memory)
  - ✅ Automatic model loading on startup

### Backend Service
- **Port**: 8000
- **Database**: SQLite (development) or PostgreSQL (production)
- **Features**:
  - ✅ FastAPI REST API
  - ✅ CORS enabled for frontend
  - ✅ Health checks every 30s
  - ✅ QR code generation
  - ✅ Supply chain tracking
  - ✅ Authentication & Authorization

### Frontend Service
- **Port**: 5173
- **Build**: Vite + React
- **Features**:
  - ✅ Multi-stage Docker build (optimized)
  - ✅ Communicates with Backend API
  - ✅ Blockchain integration ready
  - ✅ Health checks every 30s

---

## 📊 Monitoring & Health Checks

### View Service Health Status

```bash
# Check all services
docker-compose ps

# Output should show:
# NAME                    STATUS              PORTS
# pharmachain-ai          Up (healthy)        0.0.0.0:8001->8001/tcp
# pharmachain-backend     Up (healthy)        0.0.0.0:8000->8000/tcp
# pharmachain-frontend    Up (healthy)        0.0.0.0:5173->5173/tcp
```

### View Detailed Logs

```bash
# All services
docker-compose logs

# Specific service (with follow mode)
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Real-time logs from all services
docker-compose logs -f
```

### Access Container Shell (Debugging)

```bash
# Backend container
docker-compose exec backend bash

# AI Service container
docker-compose exec ai_service bash

# Frontend container
docker-compose exec frontend sh
```

---

## 🛑 Stop & Clean Services

```bash
# Stop running containers (data persists)
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove everything including volumes (WARNING: deletes data!)
docker-compose down -v

# Remove unused images/networks
docker system prune
```

---

## 🔄 Common Operations

### Rebuild After Code Changes

```bash
# Rebuild a specific service
docker-compose build backend

# Rebuild and restart
docker-compose up -d --build backend

# Rebuild all services
docker-compose build --no-cache
```

### View Resource Usage

```bash
# See CPU/Memory usage
docker stats

# Restart a specific service
docker-compose restart backend

# View container processes
docker-compose top backend
```

### Database Management

```bash
# Access SQLite database (from backend container)
docker-compose exec backend sqlite3 /app/data/pharmachain.db

# Backup database
docker cp pharmachain-backend:/app/data/pharmachain.db ./backup.db

# Restore database
docker cp ./backup.db pharmachain-backend:/app/data/pharmachain.db
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Alternative: Use different port in docker-compose
# Edit docker-compose.yml and change "8000:8000" to "8001:8000"
```

### Issue: Container Won't Start

```bash
# Check logs immediately
docker-compose logs backend

# Common causes and fixes:
# 1. Out of disk space → Clean: docker system prune -a
# 2. Port in use → See above
# 3. Bad environment variables → Check .env.local
# 4. Dependency issue → docker-compose up -d (retry)
```

### Issue: AI Service Returns Stub Response

**Status**: This means the pre-trained model hasn't loaded yet
```bash
# Solution: Wait 20 seconds for startup
# Check logs:
docker-compose logs ai_service

# Should see: "✅ Classifier loaded: Pre-trained ResNet50 ready for inference"
```

### Issue: Frontend Can't Connect to Backend

```bash
# Check backend is running
curl http://localhost:8000/health

# Check CORS configuration in Backend
# Should include: http://frontend:5173

# Network issue? Check Docker network
docker network inspect pharmachain_pharmachain-network
```

### Issue: Build Fails on M1/M2 Mac

```bash
# Build for specific platform
docker-compose build --build-arg PLATFORM=linux/arm64

# Or update docker-compose: add platform to services
# platform: linux/arm64
```

---

## 📈 Production Deployment

### Production Environment File

```bash
cp .env.local .env.prod
# Edit .env.prod with production settings:
# - Set ENVIRONMENT=production
# - Use PostgreSQL instead of SQLite
# - Disable DEBUG mode
# - Set secure SECRET_KEY
# - Update CORS_ORIGINS
```

### Start with Production Compose

```bash
# Create docker-compose.prod.yml with production settings
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Monitor with
docker-compose logs -f
```

### Database Migration (PostgreSQL)

```sql
-- Create user
CREATE USER pharmachain WITH PASSWORD 'secure-password';

-- Create database
CREATE DATABASE pharmachain OWNER pharmachain;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE pharmachain TO pharmachain;
```

---

## 🔒 Security Checklist

- [ ] Change SECRET_KEY in .env.local
- [ ] Update CORS_ORIGINS (don't expose to *)
- [ ] Use HTTPS in production (nginx reverse proxy)
- [ ] Enable database authentication
- [ ] Set resource limits (done in compose!)
- [ ] Run containers with non-root user (done!)
- [ ] Regular security updates (docker pull && rebuild)
- [ ] Backup data regularly
- [ ] Monitor container health
- [ ] Use separate networks for services

---

## 📚 Next Steps

1. ✅ **Deployment Complete** - All services running
2. 🧪 **Run Tests** - Add test suite
3. 📝 **API Documentation** - Access http://localhost:8000/docs
4. 🔗 **Blockchain Integration** - Configure ICP canister
5. 📊 **Monitoring** - Set up container logs aggregation
6. 🚀 **CI/CD** - Set up automated deployment

---

## 📞 Support

For issues, check:
- Docker logs: `docker-compose logs`
- This guide's Troubleshooting section
- Backend health: `curl http://localhost:8000/health`
- AI health: `curl http://localhost:8001/health`

---

**Last Updated**: 2026-04-15  
**Status**: ✅ All services compatible and ready for deployment
