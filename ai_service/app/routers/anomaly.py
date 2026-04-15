from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import numpy as np
from ..models.anomaly import AnomalyDetector

router = APIRouter(prefix="/anomaly", tags=["anomaly-detection"])
detector = AnomalyDetector()

class SupplyChainEvent(BaseModel):
    event_id: str
    batch_id: str
    from_principal: str
    to_principal: str
    timestamp: str
    location: str
    event_type: str
    transit_days: Optional[float] = Field(None, description="Days between this and previous event")
    num_handoffs: Optional[int] = Field(None, description="Total handoffs so far")
    route_deviation_km: Optional[float] = Field(0, description="Deviation from expected route")
    time_gap_hours: Optional[float] = Field(0, description="Hours since last event")

class AnomalyRequest(BaseModel):
    events: List[SupplyChainEvent]
    expected_route: Optional[List[str]] = None
    expected_transit_days: Optional[float] = None

class AnomalyResponse(BaseModel):
    is_anomaly: bool
    confidence: float = Field(..., ge=0, le=1)
    anomaly_score: float = Field(..., ge=0, le=1)
    severity: str = Field(..., description="low, medium, high, critical")
    reason: Optional[str] = None
    anomaly_flags: List[str] = []
    recommended_action: Optional[str] = None

@router.post("/", response_model=AnomalyResponse)
async def detect_anomaly(
    request: AnomalyRequest,
    background_tasks: BackgroundTasks = None
):
    """
    Detect anomalies in supply chain custody chain
    """
    if not request.events or len(request.events) < 2:
        return AnomalyResponse(
            is_anomaly=False,
            confidence=1.0,
            anomaly_score=0.0,
            severity="low",
            reason="Insufficient data for analysis"
        )
    
    # Prepare features for anomaly detection
    events_data = []
    for i, event in enumerate(request.events):
        event_dict = event.dict()
        
        # Calculate derived features if not provided
        if event.transit_days is None and i > 0:
            prev_ts = datetime.fromisoformat(request.events[i-1].timestamp.replace('Z', '+00:00'))
            curr_ts = datetime.fromisoformat(event.timestamp.replace('Z', '+00:00'))
            event_dict['transit_days'] = (curr_ts - prev_ts).total_seconds() / 86400
        
        if event.num_handoffs is None:
            event_dict['num_handoffs'] = i
        
        events_data.append(event_dict)
    
    # Run anomaly detection
    result = detector.predict(events_data)
    
    # Enhance with severity and recommendations
    anomaly_score = result.get("score", 0.0)
    is_anomaly = result.get("anomaly", False)
    
    if is_anomaly:
        if anomaly_score > 0.8:
            severity = "critical"
            recommended_action = "Immediate investigation required. Halt distribution."
        elif anomaly_score > 0.6:
            severity = "high"
            recommended_action = "Flag shipment for regulatory review."
        elif anomaly_score > 0.4:
            severity = "medium"
            recommended_action = "Request additional documentation from distributor."
        else:
            severity = "low"
            recommended_action = "Monitor next shipment for pattern."
    else:
        severity = "low"
        recommended_action = None
    
    return AnomalyResponse(
        is_anomaly=is_anomaly,
        confidence=1.0 - min(anomaly_score, 0.95),
        anomaly_score=anomaly_score,
        severity=severity,
        reason=result.get("reason"),
        anomaly_flags=result.get("flags", []),
        recommended_action=recommended_action
    )

@router.post("/batch")
async def batch_anomaly_detection(
    requests: List[AnomalyRequest],
    max_parallel: int = 5
):
    """
    Detect anomalies for multiple supply chains in batch
    """
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    
    async def process_one(req):
        return await detect_anomaly(req)
    
    # Process with limited concurrency
    semaphore = asyncio.Semaphore(max_parallel)
    
    async def process_with_limit(req):
        async with semaphore:
            return await process_one(req)
    
    results = await asyncio.gather(*[process_with_limit(req) for req in requests[:20]])
    
    return {
        "total_processed": len(results),
        "anomalies_detected": sum(1 for r in results if r.is_anomaly),
        "results": [r.dict() for r in results]
    }

@router.post("/train")
async def trigger_training(
    background_tasks: BackgroundTasks
):
    """
    Trigger model retraining (admin only in production)
    """
    background_tasks.add_task(retrain_model)
    return {"message": "Model training started in background", "status": "processing"}

async def retrain_model():
    """Background task to retrain anomaly detection model"""
    # This would load new data and retrain the Isolation Forest
    pass

@router.get("/stats")
async def get_anomaly_stats():
    """Get anomaly detection statistics"""
    return {
        "model_loaded": detector.ready,
        "model_type": "Isolation Forest",
        "contamination": 0.1,
        "features": ["transit_days", "num_handoffs", "route_deviation_km", "time_gap_hours"]
    }

# POST	/classify	Accepts multipart image, returns {genuine: bool, confidence: float, flags: []}	backend only
# GET	/health	Model readiness check	backend only
