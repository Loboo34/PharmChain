import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask
import base64
from io import BytesIO
from typing import Optional, Tuple
import json
from pathlib import Path
from ..core.config import settings

class QRService:
    def __init__(self):
        self.storage_path = Path(settings.QR_CODE_STORAGE_PATH)
        self.base_url = settings.QR_BASE_URL
    
    def generate_qr_code(
        self, 
        batch_id: str, 
        batch_number: str, 
        blockchain_hash: str,
        style: str = "standard"
    ) -> Tuple[str, str]:
        """
        Generate QR code for batch verification
        Returns (base64_string, file_path)
        """
        # Create verification payload
        payload = json.dumps({
            "batch_id": str(batch_id),
            "batch_number": batch_number,
            "hash": blockchain_hash,
            "verification_url": f"{self.base_url}/verify/{batch_id}"
        })
        
        # Create QR code instance
        qr = qrcode.QRCode(
            version=2,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(payload)
        qr.make(fit=True)
        
        # Generate styled QR code
        if style == "styled":
            img = qr.make_image(
                image_factory=StyledPilImage,
                module_drawer=RoundedModuleDrawer(),
                color_mask=RadialGradiantColorMask(
                    center_color=(0, 100, 200),
                    edge_color=(0, 200, 100)
                )
            )
        else:
            img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64 for immediate use
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Save to file
        file_name = f"qr_{batch_number}_{batch_id[:8]}.png"
        file_path = self.storage_path / file_name
        img.save(file_path, format="PNG")
        
        return img_base64, str(file_path)
    
    def generate_batch_qr_payload(self, batch_id: str, batch_number: str, blockchain_hash: str) -> str:
        """Generate just the JSON payload for embedding in API responses"""
        return json.dumps({
            "batch_id": str(batch_id),
            "batch_number": batch_number,
            "hash": blockchain_hash,
            "verification_url": f"{self.base_url}/verify/{batch_id}",
            "api_endpoint": f"{settings.API_V1_PREFIX}/verify/scan"
        })
    
    def decode_qr_payload(self, qr_data: str) -> dict:
        """Decode QR code payload"""
        try:
            return json.loads(qr_data)
        except json.JSONDecodeError:
            # Legacy support for plain batch ID
            return {"batch_id": qr_data, "batch_number": qr_data}
    
    def generate_verification_link(self, batch_id: str) -> str:
        """Generate a verification URL for the batch"""
        return f"{self.base_url}/verify/{batch_id}"
    
    def generate_batch_label_qr(self, batch_data: dict) -> str:
        """Generate QR for physical batch labels (compact format)"""
        # Compact format for printing on labels
        compact_data = {
            "b": str(batch_data["batch_id"])[:8],  # Shortened ID
            "n": batch_data["batch_number"],
            "h": batch_data["blockchain_hash"][:16]  # Partial hash for verification
        }
        return json.dumps(compact_data)

qr_service = QRService()