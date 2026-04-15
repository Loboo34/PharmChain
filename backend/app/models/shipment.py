from sqlalchemy import Column, String, Date, DateTime, Float, JSON, Enum, ForeignKey, Integer
from sqlalchemy.dialects.sqlite import UUID
from sqlalchemy.sql import func
import uuid
from ..core.database import Base

class ShipmentStatus:
    created = "created"
    in_transit = "in_transit"
    delivered = "delivered"
    flagged = "flagged"
    cancelled = "cancelled"

class Shipment(Base):
    __tablename__ = "shipments"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID, ForeignKey("batches.id"), nullable=False)
    from_actor = Column(UUID, ForeignKey("users.id"), nullable=False)
    to_actor = Column(UUID, ForeignKey("users.id"), nullable=False)
    status = Column(String, default=ShipmentStatus.created, nullable=False)
    origin_country = Column(String, nullable=False)
    destination_country = Column(String, nullable=False)
    expected_arrival = Column(Date, nullable=False)
    actual_arrival = Column(Date, nullable=True)
    tracking_number = Column(String, unique=True, nullable=True)
    icp_event_ids = Column(JSON, default=list)
    anomaly_score = Column(Float, default=0.0)
    temperature_log = Column(JSON, default=list)  # For cold chain monitoring
    waypoints = Column(JSON, default=list)  # List of {location, timestamp, status}
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Shipment {self.tracking_number or self.id}>"