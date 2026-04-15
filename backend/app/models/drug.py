from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.sqlite import UUID
from sqlalchemy.sql import func
import uuid
from ..core.database import Base

class Drug(Base):
    __tablename__ = "drugs"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    brand_name = Column(String, nullable=False)
    manufacturer_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    dosage_form = Column(String, nullable=False)
    strength = Column(String, nullable=False)
    who_registered = Column(Boolean, default=False)
    nafdac_number = Column(String, unique=True, nullable=False)
    icp_canister_id = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())