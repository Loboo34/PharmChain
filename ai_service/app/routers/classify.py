from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks
from typing import Optional, List
import asyncio
from ..models.classifier import PackagingClassifier
from ..utils.image_utils import validate_image, resize_image, extract_image_features

router = APIRouter(prefix="/classify", tags=["classification"])
classifier = PackagingClassifier()

class ClassificationResult:
    def __init__(self, genuine: bool, confidence: float, flags: List[str], processing_time_ms: float):
        self.genuine = genuine
        self.confidence = confidence
        self.flags = flags
        self.processing_time_ms = processing_time_ms

@router.post("/")
async def classify_image(
    image: UploadFile = File(...),
    detailed: bool = False,
    background_tasks: BackgroundTasks = None
):
    """
    Classify drug packaging image as genuine or counterfeit
    """
    import time
    start_time = time.time()
    
    # Validate image
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    # Read and validate image
    contents = await image.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image too large. Max size 10MB.")
    
    try:
        # Validate image format
        pil_image = validate_image(contents)
        
        # Resize for faster processing
        pil_image = resize_image(pil_image, max_size=800)
        
        # Classify
        result = classifier.predict(pil_image)
        
        # Extract additional features if detailed analysis requested
        if detailed:
            features = extract_image_features(pil_image)
            result["detailed_features"] = features
        
        # Add processing time
        processing_time = (time.time() - start_time) * 1000
        result["processing_time_ms"] = round(processing_time, 2)
        
        # Background task for logging (optional)
        if background_tasks:
            background_tasks.add_task(log_classification, result, image.filename)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Image processing failed: {str(e)}")

@router.post("/batch")
async def classify_batch(
    images: List[UploadFile] = File(...)
):
    """
    Classify multiple images in batch
    """
    results = []
    for image in images[:10]:  # Limit to 10 images per batch
        try:
            contents = await image.read()
            pil_image = validate_image(contents)
            pil_image = resize_image(pil_image, max_size=800)
            result = classifier.predict(pil_image)
            results.append({
                "filename": image.filename,
                **result
            })
        except Exception as e:
            results.append({
                "filename": image.filename,
                "error": str(e)
            })
    
    return {
        "total": len(images),
        "processed": len(results),
        "results": results
    }

async def log_classification(result: dict, filename: str):
    """Background task to log classifications (implement with your logging system)"""
    # This would connect to your logging/monitoring system
    pass

@router.get("/health")
async def health_check():
    """Check if classifier is ready"""
    return {
        "status": "healthy" if classifier.ready else "degraded",
        "model_loaded": classifier.ready,
        "model_type": "ResNet-50",
        "num_classes": 2
    }