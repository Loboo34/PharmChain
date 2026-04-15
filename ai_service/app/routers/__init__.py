# This file makes the routers directory a Python package
from .classify import router as classify_router
from .anomaly import router as anomaly_router
from .training import router as training_router

__all__ = ["classify_router", "anomaly_router", "training_router"]