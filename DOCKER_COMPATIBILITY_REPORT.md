# PharmChain Docker Compatibility Assessment Report

## Executive Summary
The project has **cross-team developed components** (Frontend, Backend, AI Service, Blockchain). This report identifies compatibility gaps and provides a deployment plan to ensure seamless integration.

---

## 🔴 Critical Issues Found

### 1. **Frontend Missing Docker Support** ⚠️ CRITICAL
- **Status**: No Dockerfile exists
- **Impact**: Cannot containerize frontend; docker-compose build will fail
- **Root Cause**: Frontend developed separately; build process not containerized
- **Fix Priority**: HIGHEST - Blocks entire deployment

### 2. **AI Service Model Training Not Implemented** ⚠️ CRITICAL
- **Status**: Current code returns stub responses; Expects trained `classifier.pt` weights
- **Issue**: No training pipeline or pre-trained model integrated
- **Impact**: Image classification returns default values; defeats core functionality
- **Fix Priority**: HIGHEST - Blocks AI functionality

### 3. **Service Discovery & Networking**
- **Status**: Services reference each other via hardcoded URLs
- **Issue**: `http://ai_service:8001` works in docker-compose but assumes service exists
- **Impact**: If services crash/restart, connections may fail without proper retry logic
- **Current State**: Basic fallback exists but not optimal
- **Fix Priority**: MEDIUM

### 4. **Environment Configuration**
- **Status**: CORS_ORIGINS hardcoded to `localhost:5173,localhost:3000`
- **Issue**: Won't work in production; frontend URL may change
- **Impact**: Cross-origin requests will fail in non-dev environments
- **Fix Priority**: MEDIUM

### 5. **Health Check Monitoring**
- **Status**: No health checks configured in docker-compose
- **Issue**: Container orchestration can't detect failed services
- **Impact**: Dead services won't be restarted automatically
- **Fix Priority**: MEDIUM

---

## 📊 Component Compatibility Matrix

| Component | Status | Issues | Risk |
|-----------|--------|--------|------|
| **Backend (FastAPI/Python)** | ✅ Ready | None | Low |
| **AI Service (FastAPI/PyTorch)** | ⚠️ Partial | No pre-trained model | High |
| **Frontend (React/Vite)** | ❌ Not Ready | Missing Dockerfile | Critical |
| **Blockchain (Azle/ICP)** | ⚠️ Partial | Needs integration testing | Medium |
| **Database (SQLite)** | ✅ Ready | None | Low |

---

## 📋 Detailed Findings

### Backend Service (`backend/`)
✅ **Status: COMPATIBLE**
- Dockerfile: Well-configured with Python 3.11-slim base
- Requirements: Clear dependencies (FastAPI, SQLAlchemy, etc.)
- Configuration: Proper CORS middleware, database setup
- Volume Mounts: QR code storage properly mounted
- **Recommendation**: No changes needed

### AI Service (`ai_service/`)
⚠️ **Status: PARTIALLY COMPATIBLE**
- **Dockerfile**: Good, but missing key improvements
- **Issues Identified**:
  1. ❌ No pre-trained model implementation
  2. ❌ `classifier.pt` weights file expected but not provided
  3. ⚠️ Model returns stub responses when weights unavailable
  4. ⚠️ No model caching or lazy loading strategy
- **Current Model Type**: ResNet50 (good for image classification)
- **Recommendation**: Replace with pre-trained model from Hugging Face or PyTorch Hub

### Frontend (`frontend/`)
❌ **STATUS: NOT COMPATIBLE - CRITICAL**
- **Dockerfile**: MISSING
- **Build System**: Uses Vite (configured for development)
- **Package Manager**: npm/pnpm
- **Current Setup**: `npm run dev -- --host` (development only)
- **Issues**:
  1. ❌ No production build configuration
  2. ❌ No static file serving
  3. ❌ No nginx/server configuration for Docker
- **Recommendation**: Create multi-stage Dockerfile with Vite build + static server

### Blockchain Integration (`src/blockchain/`)
⚠️ **STATUS: PARTIALLY COMPATIBLE**
- **Type**: ICP Canisters (Azle framework)
- **Configuration**: dfx.json properly set up
- **Issues**:
  1. ⚠️ DFX local network (`127.0.0.1:4943`) won't work inside Docker containers
  2. ⚠️ Frontend environment expects `http://localhost:4943`
  3. ⚠️ Network binding needs to be `0.0.0.0:4943` for Docker access
- **Recommendation**: Update dfx.json network binding; coordinate with frontend integration

### Docker-Compose Orchestration
⚠️ **STATUS: NEEDS UPDATES**
- **Current Issues**:
  1. ❌ Frontend service missing from compose file
  2. ⚠️ No health checks defined
  3. ⚠️ CORS origins hardcoded (won't work in production)
  4. ⚠️ ICP canister not integrated into compose
  5. ⚠️ Database volume not specified (data loss on container stop)
- **Recommendation**: Enhanced docker-compose with health checks, volumes, proper networking

---

## 🛡️ Security & Production Readiness

| Aspect | Current | Recommended |
|--------|---------|-------------|
| **Base Images** | python:3.11-slim ✅ | Keep; also add Node base for frontend |
| **Non-root User** | ❌ Runs as root | ✅ Create app user in Dockerfiles |
| **Health Checks** | ❌ None | ✅ Add to all services |
| **Secrets Management** | Env files ⚠️ | ✅ Use .env.example for version control |
| **Resource Limits** | ❌ None | ✅ Add memory/CPU limits to compose |
| **Network Isolation** | ⚠️ All exposed | ✅ Use internal networks where possible |

---

## 📦 Pre-Trained Model Strategy

### Current Issue
- AI service loads custom ResNet50 expecting trained weights at `ai_service/app/weights/classifier.pt`
- No training pipeline provided
- Service returns stub results when weights missing

### Recommended Solution: Use Pre-Trained Model
**Two Options**:

#### Option A: PyTorch Hub (Simpler)
- Use pre-trained ResNet50 from PyTorch
- Fine-tuned for image classification
- **Pros**: Easy swap, minimal code changes
- **Cons**: Generic model, may need fine-tuning for packaging detection

#### Option B: Hugging Face Transformers (Better)
- Use Vision Transformer or pre-trained medical imaging model
- More robust for document/packaging detection
- **Pros**: Better accuracy, community-maintained
- **Cons**: Slightly heavier (~500MB)

### Recommendation: **Hugging Face Vision Transformer**
```python
from transformers import AutoImageProcessor, AutoModelForImageClassification

# Use a pre-trained model for generic image classification
processor = AutoImageProcessor.from_pretrained("google/vit-base-patch16-224")
model = AutoModelForImageClassification.from_pretrained("google/vit-base-patch16-224")
```

**No training needed - works immediately!**

---

## 🚀 Deployment Readiness Checklist

- [ ] Frontend Dockerfile created
- [ ] AI Service updated with pre-trained model
- [ ] docker-compose.yml enhanced with health checks
- [ ] Environment variables properly configured
- [ ] NFT/Blockchain integration tested with Docker networking
- [ ] Production-ready environment file (.env.example) created
- [ ] Documentation updated for deployment
- [ ] Build verification on clean system
- [ ] Network connectivity testing between services
- [ ] Security scan of Dockerfiles

---

## Next Steps

1. ✅ **Apply Recommended Fixes** (This session)
2. 🧪 **Test Docker Build** - `docker-compose build`
3. 🚀 **Test Docker Run** - `docker-compose up`
4. 📝 **Document Results** - Create deployment guide
5. 🔄 **Cleanup** - Prepare for production deployment

---

**Report Generated**: 2026-04-15  
**Status**: Ready for implementation
