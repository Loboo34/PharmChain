from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from uuid import UUID
from ..core.database import get_db
from ..deps import require_role
from ..models.user import User
from ..models.scan_log import ScanLog
from ..models.alert import Alert
from ..models.shipment import Shipment
from ..models.batch import Batch
from ..models.drug import Drug
from pydantic import BaseModel

router = APIRouter(prefix="/analytics", tags=["analytics"])

# Response schemas
class DashboardSummary(BaseModel):
    total_scans: int
    genuine_count: int
    counterfeit_count: int
    suspect_count: int
    unregistered_count: int
    active_alerts: int
    critical_alerts: int
    counterfeit_rate: float
    blockchain_verification_rate: float

class HeatmapPoint(BaseModel):
    location: str
    lat: Optional[float]
    lng: Optional[float]
    counterfeit_count: int
    total_scans: int
    severity: str

class TrendData(BaseModel):
    date: str
    scans: int
    counterfeit_detections: int
    alerts_raised: int
    genuine_rate: float

class TopCounterfeitDrug(BaseModel):
    drug_name: str
    manufacturer: str
    counterfeit_count: int
    total_scans: int

class ShipmentAnalytics(BaseModel):
    total_shipments: int
    on_time_delivery_rate: float
    flagged_shipments: int
    average_transit_days: float
    anomaly_detection_rate: float

@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    days: int = Query(30, description="Look back period in days"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(["regulator"]))
):
    """Get key metrics for regulator dashboard"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Scan statistics
    scan_result = await db.execute(
        select(
            func.count(),
            func.sum(func.case((ScanLog.verdict == "genuine", 1), else_=0)),
            func.sum(func.case((ScanLog.verdict == "counterfeit", 1), else_=0)),
            func.sum(func.case((ScanLog.verdict == "suspect", 1), else_=0)),
            func.sum(func.case((ScanLog.verdict == "unregistered", 1), else_=0)),
            func.avg(func.case((ScanLog.blockchain_verified == True, 1), else_=0))
        ).where(ScanLog.scanned_at >= cutoff_date)
    )
    row = scan_result.first()
    
    total_scans = row[0] or 0
    genuine_count = row[1] or 0
    counterfeit_count = row[2] or 0
    suspect_count = row[3] or 0
    unregistered_count = row[4] or 0
    blockchain_rate = (row[5] or 0) * 100
    
    # Alert statistics
    alert_result = await db.execute(
        select(
            func.count(),
            func.sum(func.case((Alert.severity == "critical", 1), else_=0))
        ).where(Alert.created_at >= cutoff_date, Alert.resolved == False)
    )
    alert_row = alert_result.first()
    active_alerts = alert_row[0] or 0
    critical_alerts = alert_row[1] or 0
    
    counterfeit_rate = (counterfeit_count / total_scans * 100) if total_scans > 0 else 0
    
    return DashboardSummary(
        total_scans=total_scans,
        genuine_count=genuine_count,
        counterfeit_count=counterfeit_count,
        suspect_count=suspect_count,
        unregistered_count=unregistered_count,
        active_alerts=active_alerts,
        critical_alerts=critical_alerts,
        counterfeit_rate=round(counterfeit_rate, 2),
        blockchain_verification_rate=round(blockchain_rate, 2)
    )

@router.get("/heatmap", response_model=List[HeatmapPoint])
async def get_counterfeit_heatmap(
    days: int = Query(90, description="Look back period in days"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(["regulator"]))
):
    """Get geographic distribution of counterfeit detections"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Group scans by location
    result = await db.execute(
        select(
            ScanLog.scan_location,
            func.count(),
            func.sum(func.case((ScanLog.verdict == "counterfeit", 1), else_=0))
        )
        .where(ScanLog.scanned_at >= cutoff_date)
        .group_by(ScanLog.scan_location)
        .having(func.sum(func.case((ScanLog.verdict == "counterfeit", 1), else_=0)) > 0)
    )
    
    heatmap_data = []
    # Location coordinates mapping (simplified - would use geocoding in production)
    location_coords = {
        "Lagos, Nigeria": (6.5244, 3.3792),
        "Nairobi, Kenya": (-1.2921, 36.8219),
        "Accra, Ghana": (5.6037, -0.1870),
        "Dakar, Senegal": (14.7167, -17.4677),
        "Dar es Salaam, Tanzania": (-6.7924, 39.2083),
        "Abuja, Nigeria": (9.0765, 7.3986),
        "Mombasa, Kenya": (-4.0435, 39.6682),
        "Kumasi, Ghana": (6.6666, -1.6163),
    }
    
    for row in result.all():
        location = row[0]
        total_scans = row[1]
        counterfeit_count = row[2]
        
        coords = location_coords.get(location, (None, None))
        
        # Determine severity based on counterfeit proportion
        proportion = counterfeit_count / total_scans if total_scans > 0 else 0
        if proportion > 0.3:
            severity = "high"
        elif proportion > 0.1:
            severity = "medium"
        else:
            severity = "low"
        
        heatmap_data.append(HeatmapPoint(
            location=location,
            lat=coords[0],
            lng=coords[1],
            counterfeit_count=counterfeit_count,
            total_scans=total_scans,
            severity=severity
        ))
    
    return heatmap_data

@router.get("/trends", response_model=List[TrendData])
async def get_trend_data(
    days: int = Query(90, description="Number of days to analyze"),
    interval: str = Query("day", description="Interval: day, week, month"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(["regulator"]))
):
    """Get time-series data for trends analysis"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Determine grouping function based on interval
    if interval == "week":
        group_by = func.strftime("%Y-%W", ScanLog.scanned_at)
    elif interval == "month":
        group_by = func.strftime("%Y-%m", ScanLog.scanned_at)
    else:  # day
        group_by = func.date(ScanLog.scanned_at)
    
    # Query scan trends
    scan_result = await db.execute(
        select(
            group_by.label("period"),
            func.count(),
            func.sum(func.case((ScanLog.verdict == "counterfeit", 1), else_=0)),
            func.avg(func.case((ScanLog.verdict == "genuine", 1), else_=0))
        )
        .where(ScanLog.scanned_at >= cutoff_date)
        .group_by("period")
        .order_by("period")
    )
    
    # Query alert trends
    alert_result = await db.execute(
        select(
            func.date(Alert.created_at).label("period"),
            func.count()
        )
        .where(Alert.created_at >= cutoff_date)
        .group_by("period")
    )
    alerts_by_period = {row[0]: row[1] for row in alert_result.all()}
    
    trends = []
    for row in scan_result.all():
        period = row[0]
        scans = row[1] or 0
        counterfeit = row[2] or 0
        genuine_rate = (row[3] or 0) * 100
        
        trends.append(TrendData(
            date=period,
            scans=scans,
            counterfeit_detections=counterfeit,
            alerts_raised=alerts_by_period.get(period, 0),
            genuine_rate=round(genuine_rate, 2)
        ))
    
    return trends

@router.get("/top-counterfeit-drugs", response_model=List[TopCounterfeitDrug])
async def get_top_counterfeit_drugs(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(["regulator"]))
):
    """Get drugs most frequently flagged as counterfeit"""
    result = await db.execute(
        select(
            Drug.name,
            Drug.brand_name,
            func.count(ScanLog.id).label("counterfeit_count"),
            func.sum(func.case((ScanLog.verdict == "counterfeit", 1), else_=0))
        )
        .join(Batch, Batch.drug_id == Drug.id)
        .join(ScanLog, ScanLog.batch_id == Batch.id)
        .where(ScanLog.verdict == "counterfeit")
        .group_by(Drug.id)
        .order_by(func.count(ScanLog.id).desc())
        .limit(limit)
    )
    
    drugs = []
    for row in result.all():
        drugs.append(TopCounterfeitDrug(
            drug_name=f"{row[0]} ({row[1]})",
            manufacturer=row[0],  # Would join with manufacturer
            counterfeit_count=row[2] or 0,
            total_scans=row[3] or 0
        ))
    
    return drugs

@router.get("/shipments", response_model=ShipmentAnalytics)
async def get_shipment_analytics(
    days: int = Query(90, description="Look back period in days"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(["regulator"]))
):
    """Get supply chain performance analytics"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(
            func.count(),
            func.sum(func.case((Shipment.status == "delivered", 1), else_=0)),
            func.sum(func.case((Shipment.status == "flagged", 1), else_=0)),
            func.avg(func.julianday(Shipment.actual_arrival) - func.julianday(Shipment.created_at)),
            func.avg(Shipment.anomaly_score)
        )
        .where(Shipment.created_at >= cutoff_date)
    )
    row = result.first()
    
    total = row[0] or 0
    delivered = row[1] or 0
    flagged = row[2] or 0
    avg_transit = row[3] or 0
    avg_anomaly = row[4] or 0
    
    on_time_rate = (delivered / total * 100) if total > 0 else 0
    anomaly_rate = (flagged / total * 100) if total > 0 else 0
    
    return ShipmentAnalytics(
        total_shipments=total,
        on_time_delivery_rate=round(on_time_rate, 2),
        flagged_shipments=flagged,
        average_transit_days=round(avg_transit, 1),
        anomaly_detection_rate=round(anomaly_rate, 2)
    )

@router.get("/country-comparison")
async def get_country_comparison(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(["regulator"]))
):
    """Compare counterfeit rates across countries"""
    result = await db.execute(
        select(
            ScanLog.scan_location,
            func.count(),
            func.sum(func.case((ScanLog.verdict == "counterfeit", 1), else_=0))
        )
        .group_by(ScanLog.scan_location)
    )
    
    comparison = []
    for row in result.all():
        location = row[0]
        total = row[1] or 0
        counterfeit = row[2] or 0
        rate = (counterfeit / total * 100) if total > 0 else 0
        
        comparison.append({
            "country": location,
            "total_scans": total,
            "counterfeit_detections": counterfeit,
            "counterfeit_rate": round(rate, 2)
        })
    
    return sorted(comparison, key=lambda x: x["counterfeit_rate"], reverse=True)