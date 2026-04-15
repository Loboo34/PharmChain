from sqlalchemy import Column, String, Text, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.sqlite import UUID
from sqlalchemy.sql import func
import uuid
from ..core.database import Base

class AlertType:
    counterfeit = "counterfeit"
    unregistered = "unregistered"
    anomaly = "anomaly"
    recall = "recall"

class AlertSeverity:
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    scan_log_id = Column(UUID, ForeignKey("scan_logs.id"), nullable=True)
    batch_id = Column(UUID, ForeignKey("batches.id"), nullable=True)
    alert_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=True)
    icp_alert_tx = Column(String, nullable=True)
    resolved = Column(Boolean, default=False)
    resolved_by = Column(UUID, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())