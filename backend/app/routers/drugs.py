from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
import hashlib
import json
from ..core.database import get_db
from ..deps import get_current_user, require_role
from ..models.user import User
from ..models.drug import Drug
from ..models.batch import Batch
from ..schemas import DrugCreate, DrugResponse, BatchCreate, BatchResponse
from ..services.icp_service import icp_service
from ..services.qr_service import qr_service

router = APIRouter(prefix="/drugs", tags=["drugs"])

@router.post("/", response_model=DrugResponse, status_code=201)
async def register_drug(
    drug_data: DrugCreate,
    current_user: User = Depends(require_role(["manufacturer"])),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role == "manufacturer" and str(current_user.id) != str(drug_data.manufacturer_id):
        raise HTTPException(status_code=403, detail="Cannot register drug for another manufacturer")
    
    drug = Drug(**drug_data.model_dump())
    db.add(drug)
    await db.flush()
    await db.refresh(drug)
    
    return drug

@router.get("/", response_model=list[DrugResponse])
async def list_drugs(
    skip: int = 0,
    limit: int = 100,
    manufacturer_id: UUID = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Drug)
    if manufacturer_id:
        query = query.where(Drug.manufacturer_id == manufacturer_id)
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{drug_id}", response_model=DrugResponse)
async def get_drug(drug_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Drug).where(Drug.id == drug_id))
    drug = result.scalar_one_or_none()
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    return drug

@router.post("/{drug_id}/batches", response_model=BatchResponse, status_code=201)
async def register_batch(
    drug_id: UUID,
    batch_data: BatchCreate,
    current_user: User = Depends(require_role(["manufacturer"])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Drug).where(Drug.id == drug_id))
    drug = result.scalar_one_or_none()
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    
    if drug.manufacturer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot add batch to another manufacturer's drug")
    
    # Generate blockchain hash
    hash_input = f"{drug_id}{batch_data.batch_number}{batch_data.production_date}{batch_data.expiry_date}"
    blockchain_hash = hashlib.sha256(hash_input.encode()).hexdigest()
    
    # Register the new batch on ICP drug registry
    icp_result = await icp_service.register_batch(
        drug_id=str(drug_id),
        batch_number=batch_data.batch_number,
        batch_hash=blockchain_hash,
        production_date=batch_data.production_date.isoformat(),
        expiry_date=batch_data.expiry_date.isoformat(),
        quantity=batch_data.quantity,
    )
    
    batch_id_on_chain = icp_result.get("batch_id") or icp_result.get("ok")
    
    # Generate QR code payload for verification
    qr_payload = json.dumps({
        "batch_id": batch_id_on_chain or str(drug_id),
        "batch_number": batch_data.batch_number,
        "hash": blockchain_hash
    })
    
    batch = Batch(
        drug_id=drug_id,
        batch_number=batch_data.batch_number,
        quantity=batch_data.quantity,
        production_date=batch_data.production_date,
        expiry_date=batch_data.expiry_date,
        blockchain_hash=blockchain_hash,
        icp_tx_id=batch_id_on_chain,
        qr_code_url=qr_payload
    )
    
    db.add(batch)
    await db.flush()
    await db.refresh(batch)
    
    return batch

# GET	/drugs/{id}/batches	List all batches for a drug	any
# GET	/batches/{batch_id}	Full batch info: expiry, production date, QR code URL	any
# GET	/batches/{batch_id}/qr	Download QR code PNG for batch	manufacturer
