from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime, date
from typing import Optional, List

# User schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str
    organization: Optional[str] = None
    license_number: Optional[str] = None
    country: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    organization: Optional[str] = None
    country: str
    is_active: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

# Drug schemas
class DrugCreate(BaseModel):
    name: str
    brand_name: str
    manufacturer_id: UUID
    dosage_form: str
    strength: str
    who_registered: bool = False
    nafdac_number: str

class DrugResponse(DrugCreate):
    id: UUID
    icp_canister_id: Optional[str] = None
    created_at: datetime

# Batch schemas
class BatchCreate(BaseModel):
    batch_number: str
    quantity: int
    production_date: date
    expiry_date: date

class BatchOut(BaseModel):
    id: UUID
    drug_id: UUID
    batch_number: str
    quantity: int
    production_date: date
    expiry_date: date
    status: str
    blockchain_hash: str

# Scan schemas
class ScanResult(BaseModel):
    scan_id: UUID
    verdict: str
    ai_confidence: Optional[float]
    blockchain_verified: bool
    ai_flags: List[str]
    batch: Optional[BatchOut]
    message: str

# Shipment schemas
class ShipmentCreate(BaseModel):
    batch_id: UUID
    to_actor: UUID
    origin_country: str
    destination_country: str
    expected_arrival: date

class ShipmentResponse(BaseModel):
    id: UUID
    batch_id: UUID
    status: str
    origin_country: str
    destination_country: str
    expected_arrival: date