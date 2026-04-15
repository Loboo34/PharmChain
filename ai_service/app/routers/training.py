from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from io import StringIO, BytesIO
import joblib
from pathlib import Path
from datetime import datetime

router = APIRouter(prefix="/training", tags=["model-training"])

class TrainingConfig(BaseModel):
    model_type: str = "isolation_forest"
    contamination: float = 0.1
    random_state: int = 42
    n_estimators: int = 100

class TrainingResult(BaseModel):
    success: bool
    model_path: str
    metrics: Dict[str, Any]
    training_samples: int
    timestamp: str

@router.post("/anomaly", response_model=TrainingResult)
async def train_anomaly_detector(
    config: TrainingConfig,
    background_tasks: BackgroundTasks,
    csv_file: UploadFile = File(None)
):
    """
    Train the anomaly detection model with supply chain data
    """
    if not csv_file:
        raise HTTPException(status_code=400, detail="CSV file required")
    
    # Read CSV data
    contents = await csv_file.read()
    df = pd.read_csv(BytesIO(contents))
    
    # Validate required columns
    required_columns = ['transit_days', 'num_handoffs', 'route_deviation_km', 'time_gap_hours']
    missing_cols = [col for col in required_columns if col not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")
    
    # Prepare features
    X = df[required_columns].fillna(0)
    
    # Train Isolation Forest
    from sklearn.ensemble import IsolationForest
    model = IsolationForest(
        contamination=config.contamination,
        random_state=config.random_state,
        n_estimators=config.n_estimators
    )
    model.fit(X)
    
    # Save model
    weights_path = Path(__file__).parent.parent / "weights"
    weights_path.mkdir(exist_ok=True)
    model_path = weights_path / "anomaly_model.joblib"
    joblib.dump(model, model_path)
    
    # Calculate metrics
    predictions = model.predict(X)
    anomaly_rate = (predictions == -1).mean()
    
    return TrainingResult(
        success=True,
        model_path=str(model_path),
        metrics={
            "anomaly_rate": float(anomaly_rate),
            "contamination": config.contamination,
            "n_estimators": config.n_estimators,
            "training_samples": len(X)
        },
        training_samples=len(X),
        timestamp=datetime.utcnow().isoformat()
    )

@router.post("/classifier")
async def train_classifier(
    background_tasks: BackgroundTasks,
    images_zip: UploadFile = File(...),
    labels_csv: UploadFile = File(...)
):
    """
    Train the packaging classifier with labeled image data
    """
    # This would implement training for the ResNet-50 classifier
    # For now, return a placeholder
    return {
        "message": "Classifier training endpoint",
        "status": "implement with PyTorch training loop",
        "estimated_time": "2-4 hours on GPU"
    }

@router.get("/status")
async def get_training_status():
    """Get status of ongoing training jobs"""
    weights_path = Path(__file__).parent.parent / "weights"
    
    anomaly_model_path = weights_path / "anomaly_model.joblib"
    classifier_path = weights_path / "classifier.pt"
    
    return {
        "anomaly_model": {
            "exists": anomaly_model_path.exists(),
            "last_modified": anomaly_model_path.stat().st_mtime if anomaly_model_path.exists() else None
        },
        "classifier_model": {
            "exists": classifier_path.exists(),
            "last_modified": classifier_path.stat().st_mtime if classifier_path.exists() else None
        }
    }