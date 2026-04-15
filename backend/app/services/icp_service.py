import httpx
from typing import Dict, Any
from ..core.config import settings

class ICPService:
    def __init__(self):
        self.icp_url = settings.ICP_URL
        
    async def verify_batch_hash(self, batch_hash: str) -> Dict[str, Any]:
        """Verify batch hash on ICP drug registry canister."""
        if not settings.DRUG_REGISTRY_CANISTER_ID:
            return {"verified": True, "stub": True}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.icp_url}/canister/{settings.DRUG_REGISTRY_CANISTER_ID}/verifyHash",
                    params={"hash": batch_hash},
                    timeout=10.0
                )
                return response.json()
            except Exception as exc:
                return {"verified": False, "error": "ICP unreachable", "details": str(exc)}

    async def register_batch(
        self,
        drug_id: str,
        batch_number: str,
        batch_hash: str,
        production_date: str,
        expiry_date: str,
        quantity: int,
    ) -> Dict[str, Any]:
        """Register a new batch on the ICP drug registry canister."""
        if not settings.DRUG_REGISTRY_CANISTER_ID:
            return {"batch_id": f"mock-batch-{batch_number}", "stub": True}

        payload = {
            "drugId": drug_id,
            "batchNumber": batch_number,
            "batchHash": batch_hash,
            "productionDate": production_date,
            "expiryDate": expiry_date,
            "quantity": quantity,
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.icp_url}/canister/{settings.DRUG_REGISTRY_CANISTER_ID}/registerBatch",
                    json=payload,
                    timeout=15.0
                )
                return response.json()
            except Exception as exc:
                return {"batch_id": None, "error": "ICP unreachable", "details": str(exc)}
    
    async def flag_counterfeit_on_chain(
        self,
        batch_id: str,
        reporter_principal: str,
        verdict: str,
        location: str,
        evidence_hash: str,
    ) -> Dict[str, Any]:
        """Record counterfeit alert on the ICP verification canister."""
        if not settings.VERIFICATION_CANISTER_ID:
            return {"tx_id": f"mock-tx-{batch_id}", "stub": True}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.icp_url}/canister/{settings.VERIFICATION_CANISTER_ID}/flagCounterfeit",
                    json={
                        "batch_id": batch_id,
                        "reporter_principal": reporter_principal,
                        "verdict": verdict,
                        "location": location,
                        "evidence_hash": evidence_hash,
                    },
                    timeout=15.0
                )
                return response.json()
            except Exception as exc:
                return {"tx_id": None, "error": "ICP unreachable", "details": str(exc)}
    
    async def add_custody_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a custody event to the ICP supply chain canister."""
        if not settings.SUPPLY_CHAIN_CANISTER_ID:
            return {"event_id": f"mock-event-{event_data.get('batch_id')}", "stub": True}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.icp_url}/canister/{settings.SUPPLY_CHAIN_CANISTER_ID}/addEvent",
                    json=event_data,
                    timeout=15.0
                )
                return response.json()
            except Exception as exc:
                return {"event_id": None, "error": "ICP unreachable", "details": str(exc)}

icp_service = ICPService()