from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func, and_
from sqlalchemy.orm import selectinload
from uuid import UUID
from datetime import datetime, timedelta
from typing import Optional, List
from ..core.database import get_db
from ..deps import get_current_user, require_role
from ..models.user import User
from ..models.alert import Alert, AlertType, AlertSeverity
from ..models.scan_log import ScanLog
from ..models.batch import Batch
from ..services.icp_service import icp_service
from pydantic import BaseModel

router = APIRouter(prefix="/alerts", tags=["alerts"])

# Pydantic schemas for alerts
class AlertCreate(BaseModel):
    batch_id: Optional[UUID] = None
    alert_type: str
    severity: str
    description: str
    location: Optional[str] = None

class AlertResponse(BaseModel):
    id: UUID
    scan_log_id: Optional[UUID]
    batch_id: Optional[UUID]
    alert_type: str
    severity: str
    description: str
    location: Optional[str]
    resolved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class AlertResolve(BaseModel):
    notes: Optional[str] = None

class AlertStats(BaseModel):
    total_alerts: int
    by_severity: dict
    by_type: dict
    resolved_count: int
    unresolved_count: int

@router.get("/", response_model=List[AlertResponse])
async def list_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity"),
    alert_type: Optional[str] = Query(None, description="Filter by type"),
    resolved: Optional[bool] = Query(None, description="Filter by resolution status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["regulator", "pharmacy", "manufacturer"]))
):
    """List alerts with filtering options"""
    query = select(Alert)
    
    # Apply filters
    if severity:
        query = query.where(Alert.severity == severity)
    if alert_type:
        query = query.where(Alert.alert_type == alert_type)
    if resolved is not None:
        query = query.where(Alert.resolved == resolved)
    
    # Role-based filtering
    if current_user.role == "pharmacy":
        # Pharmacies see alerts in their country
        query = query.where(Alert.location.contains(current_user.country))
    elif current_user.role == "manufacturer":
        # Manufacturers see alerts for their batches
        query = query.where(Alert.batch_id.in_(
            select(Batch.id).where(Batch.manufacturer_id == current_user.id)
        ))
    
    query = query.order_by(Alert.created_at.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    alerts = result.scalars().all()
    
    return alerts

@router.get("/stats", response_model=AlertStats)
async def get_alert_stats(
    days: int = Query(30, description="Look back period in days"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["regulator"]))
):
    """Get alert statistics for dashboard"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Total alerts in period
    total_result = await db.execute(
        select(func.count()).where(Alert.created_at >= cutoff_date)
    )
    total_alerts = total_result.scalar()
    
    # By severity
    severity_result = await db.execute(
        select(Alert.severity, func.count())
        .where(Alert.created_at >= cutoff_date)
        .group_by(Alert.severity)
    )
    by_severity = {row[0]: row[1] for row in severity_result.all()}
    
    # By type
    type_result = await db.execute(
        select(Alert.alert_type, func.count())
        .where(Alert.created_at >= cutoff_date)
        .group_by(Alert.alert_type)
    )
    by_type = {row[0]: row[1] for row in type_result.all()}
    
    # Resolution status
    resolved_result = await db.execute(
        select(func.count()).where(Alert.resolved == True, Alert.created_at >= cutoff_date)
    )
    resolved_count = resolved_result.scalar()
    
    return AlertStats(
        total_alerts=total_alerts or 0,
        by_severity=by_severity,
        by_type=by_type,
        resolved_count=resolved_count or 0,
        unresolved_count=(total_alerts or 0) - (resolved_count or 0)
    )

@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(
    alert_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["regulator", "pharmacy"]))
):
    """Get detailed alert information"""
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return alert

@router.put("/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    alert_id: UUID,
    resolve_data: AlertResolve,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["regulator"]))
):
    """Mark an alert as resolved"""
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.resolved = True
    alert.resolved_by = current_user.id
    
    # Add resolution notes to description if provided
    if resolve_data.notes:
        alert.description = f"{alert.description}\n\nResolution notes: {resolve_data.notes}"
    
    await db.flush()
    await db.refresh(alert)
    
    return alert

@router.post("/report", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def report_alert(
    alert_data: AlertCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually report a counterfeit or suspicious drug"""
    
    # Create the alert
    alert = Alert(
        alert_type=alert_data.alert_type,
        severity=alert_data.severity,
        description=alert_data.description,
        location=alert_data.location or current_user.country,
        batch_id=alert_data.batch_id
    )
    
    db.add(alert)
    await db.flush()
    await db.refresh(alert)
    
    # Record on ICP if available
    if alert_data.batch_id:
        await icp_service.flag_counterfeit_on_chain(
            batch_id=str(alert_data.batch_id),
            reporter_principal=current_user.icp_principal or "",
            verdict=alert_data.alert_type,
            location=alert_data.location or current_user.country,
            evidence_hash=f"alert_{alert.id}"
        )
    
    return alert

@router.post("/{alert_id}/escalate")
async def escalate_alert(
    alert_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["regulator"]))
):
    """Escalate alert severity (e.g., from high to critical)"""
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    severity_order = ["low", "medium", "high", "critical"]
    current_idx = severity_order.index(alert.severity)
    
    if current_idx < len(severity_order) - 1:
        alert.severity = severity_order[current_idx + 1]
        await db.flush()
        
        return {"message": f"Alert escalated to {alert.severity}", "severity": alert.severity}
    
    return {"message": "Alert already at highest severity", "severity": alert.severity}