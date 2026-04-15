from fastapi import APIRouter, Depends, File, Form, UploadFile, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.drug import Batch
from app.models.shipment import ScanLog, Alert, Verdict, AlertType, AlertSeverity
from app.services import ai_service, icp_service
from app.schemas import ScanResult
from app.core.config import settings
import json, uuid

router = APIRouter(prefix="/verify", tags=["verification"])

@router.post("/scan", response_model=ScanResult)
async def scan_drug(
    qr_data: str = Form(...),
    location: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Parse QR payload
    try:
        payload = json.loads(qr_data)
        batch_id = payload.get("batch_id")
        batch_hash = payload.get("hash")
    except Exception:
        batch_id, batch_hash = None, qr_data

    # 2. Lookup batch in local DB
    batch = None
    if batch_id:
        result = await db.execute(select(Batch).where(Batch.id == batch_id))
        batch = result.scalar_one_or_none()

    # 3. Verify hash on ICP blockchain
    icp_result = await icp_service.verify_batch_hash(batch_hash or "")
    blockchain_verified = icp_result.get("verified", False)

    # 4. AI image classification (if image provided)
    ai_confidence = None
    ai_flags = []
    if image:
        image_bytes = await image.read()
        ai_result = await ai_service.classify_packaging_image(image_bytes, image.filename)
        ai_confidence = ai_result.get("confidence", 0.0)
        ai_flags = ai_result.get("flags", [])

    # 5. Determine verdict
    if not blockchain_verified:
        verdict = Verdict.unregistered
    elif ai_confidence is not None and ai_confidence < settings.AI_CONFIDENCE_THRESHOLD:
        verdict = Verdict.suspect if ai_confidence > 0.4 else Verdict.counterfeit
    else:
        verdict = Verdict.genuine

    # 6. Save scan log
    scan = ScanLog(
        scanned_by=current_user.id,
        batch_id=batch_id,
        scan_location=location,
        verdict=verdict,
        ai_confidence=ai_confidence,
        blockchain_verified=blockchain_verified,
        ai_flags=ai_flags,
        raw_qr_data=qr_data,
    )
    db.add(scan)
    await db.flush()

    # 7. Auto-raise alert for counterfeit/unregistered
    if verdict in (Verdict.counterfeit, Verdict.unregistered):
        severity = AlertSeverity.critical if verdict == Verdict.unregistered else AlertSeverity.high
        alert = Alert(
            scan_log_id=scan.id,
            batch_id=batch_id,
            alert_type=AlertType.counterfeit if verdict == Verdict.counterfeit else AlertType.unregistered,
            severity=severity,
            description=f"{verdict.value.capitalize()} drug detected at {location or 'unknown location'}",
            location=location,
        )
        db.add(alert)
        # Also flag on ICP
        await icp_service.flag_counterfeit_on_chain(
            batch_id or "", current_user.icp_principal or "",
            verdict.value, location or "", batch_hash or ""
        )

    messages = {
        Verdict.genuine: "Drug verified as genuine.",
        Verdict.suspect: "Drug appears suspect. Exercise caution.",
        Verdict.counterfeit: "WARNING: Counterfeit drug detected. Alert raised.",
        Verdict.unregistered: "CRITICAL: Drug not found in registry. Do not dispense.",
    }

    from app.schemas import BatchOut
    return ScanResult(
        scan_id=scan.id,
        verdict=verdict,
        ai_confidence=ai_confidence,
        blockchain_verified=blockchain_verified,
        ai_flags=ai_flags,
        batch=BatchOut.model_validate(batch) if batch else None,
        message=messages[verdict],
    )