from sqlalchemy import Column, String, Integer, Date, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.sqlite import UUID
from sqlalchemy.sql import func
import uuid
from ..core.database import Base

class Batch(Base):
    __tablename__ = "batches"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    drug_id = Column(UUID, ForeignKey("drugs.id"), nullable=False)
    batch_number = Column(String, nullable=False, unique=True)
    quantity = Column(Integer, nullable=False)
    production_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)
    blockchain_hash = Column(String, nullable=False)
    icp_tx_id = Column(String, nullable=True)
    qr_code_url = Column(String, nullable=True)
    status = Column(Enum("active", "recalled", "expired"), default="active")
    created_at = Column(DateTime, server_default=func.now())