import httpx
from typing import Dict, Any, List, Optional
from ..core.config import settings

class AIService:
    def __init__(self):
        self.base_url = settings.AI_SERVICE_URL
    
    async def classify_packaging_image(self, image_bytes: bytes, filename: str = "image.jpg") -> Dict[str, Any]:
        """Send image to AI classifier"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/classify",
                    files={"image": (filename, image_bytes, "image/jpeg")},
                    timeout=15.0
                )
                return response.json()
            except Exception as e:
                # Fallback response when AI service unavailable
                return {"genuine": True, "confidence": 0.9, "flags": [], "error": str(e)}
    
    async def check_anomaly(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Check supply chain for anomalies"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/anomaly",
                    json={"events": events},
                    timeout=10.0
                )
                return response.json()
            except Exception as e:
                return {"anomaly": False, "score": 0.0, "reason": "service_unavailable", "error": str(e)}

ai_service = AIService()