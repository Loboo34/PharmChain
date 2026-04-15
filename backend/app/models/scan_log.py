from sqlalchemy import Column, String, DateTime, Float, Boolean, JSON, Enum, ForeignKey
from sqlalchemy.dialects.sqlite import UUID
from sqlalchemy.sql import func
import uuid
from ..core.database import Base

class Verdict:
    genuine = "genuine"
    suspect = "suspect"
    counterfeit = "counterfeit"
    unregistered = "unregistered"

class ScanLog(Base):
    __tablename__ = "scan_logs"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    scanned_by = Column(UUID, ForeignKey("users.id"), nullable=True)
    batch_id = Column(UUID, ForeignKey("batches.id"), nullable=True)
    scan_location = Column(String, nullable=True)
    verdict = Column(String, nullable=False)  # genuine|suspect|counterfeit|unregistered
    ai_confidence = Column(Float, nullable=True)
    blockchain_verified = Column(Boolean, default=False)
    image_url = Column(String, nullable=True)
    ai_flags = Column(JSON, default=list)
    raw_qr_data = Column(String, nullable=True)
    scanned_at = Column(DateTime, server_default=func.now())