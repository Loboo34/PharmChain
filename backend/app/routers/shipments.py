from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import date
from ..core.database import get_db
from ..deps import get_current_user
from ..models.user import User
from ..models.batch import Batch
from ..models.shipment import Shipment
from ..models.alert import Alert, AlertType, AlertSeverity
from ..schemas import ShipmentCreate, ShipmentResponse, ShipmentUpdate
from ..services.icp_service import icp_service
from ..services.ai_service import ai_service

router = APIRouter(prefix="/shipments", tags=["shipments"])

@router.post("/", response_model=ShipmentResponse, status_code=201)
async def create_shipment(
    shipment_data: ShipmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Batch).where(Batch.id == shipment_data.batch_id))
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    custody_event = await icp_service.add_custody_event({
        "batchId": str(shipment_data.batch_id),
        "toPrincipal": str(shipment_data.to_actor),
        "location": shipment_data.destination_country,
        "eventType": {"dispatched": null},
        "notes": f"Shipment from {shipment_data.origin_country} to {shipment_data.destination_country}",
    })
    
    shipment = Shipment(
        batch_id=shipment_data.batch_id,
        from_actor=current_user.id,
        to_actor=shipment_data.to_actor,
        origin_country=shipment_data.origin_country,
        destination_country=shipment_data.destination_country,
        expected_arrival=shipment_data.expected_arrival,
        icp_event_ids=[custody_event.get("event_id")]
    )
    
    db.add(shipment)
    await db.flush()
    await db.refresh(shipment)
    
    return shipment

@router.put("/{shipment_id}/receive")
async def receive_shipment(
    shipment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Shipment).where(Shipment.id == shipment_id))
    shipment = result.scalar_one_or_none()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    shipment.status = "delivered"
    shipment.actual_arrival = date.today()
    
    # Simple anomaly detection (would call AI in production)
    if shipment.anomaly_score > 0.7:
        shipment.status = "flagged"
        alert = Alert(
            batch_id=shipment.batch_id,
            alert_type=AlertType.anomaly,
            severity=AlertSeverity.medium,
            description=f"Supply chain anomaly detected for shipment {shipment_id}",
            location=shipment.destination_country
        )
        db.add(alert)
    
    await icp_service.add_custody_event({
        "batchId": str(shipment.batch_id),
        "toPrincipal": str(current_user.icp_principal or current_user.id),
        "location": shipment.destination_country,
        "eventType": {"received": null},
        "notes": f"Shipment received by {current_user.organization or current_user.id}",
    })
    
    await db.flush()
    
    return {"status": shipment.status, "anomaly_score": shipment.anomaly_score}

# GET	/shipments	List shipments for current actor	any
# GET	/shipments/{id}	Full shipment detail + custody chain from ICP	any
# PUT	/shipments/{id}/status	Update shipment status (in_transit → delivered); appends ICP event	distributor, pharmacy