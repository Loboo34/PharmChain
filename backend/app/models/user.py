from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.dialects.sqlite import UUID
from sqlalchemy.sql import func
import uuid
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum("manufacturer", "distributor", "pharmacy", "regulator", "consumer"), nullable=False)
    organization = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    country = Column(String, nullable=False)
    icp_principal = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())