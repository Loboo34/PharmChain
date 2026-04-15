from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List
import io
from PIL import Image
from app.models.classifier import PackagingClassifier
from app.models.anomaly import AnomalyDetector

app = FastAPI(title="PharmChain AI Service", version="1.0.0")
classifier = PackagingClassifier()
detector = AnomalyDetector()

class AnomalyRequest(BaseModel):
    events: List[dict]

@app.post("/classify")
async def classify_image(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        result = classifier.predict(pil_image)
        return result
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/anomaly")
async def detect_anomaly(request: AnomalyRequest):
    result = detector.predict(request.events)
    return result

@app.get("/health")
async def health():
    return {"status": "ok", "classifier_ready": classifier.ready, "detector_ready": detector.ready}