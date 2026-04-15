import httpx
from typing import Dict, Any, Optional
from ..core.config import settings

class ICPService:
    def __init__(self):
        self.icp_url = settings.ICP_URL
        
    async def verify_batch_hash(self, batch_hash: str) -> Dict[str, Any]:
        """Verify batch hash on ICP canister"""
        if not settings.DRUG_REGISTRY_CANISTER_ID:
            # Mock for development
            return {"verified": True, "stub": True}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.icp_url}/canister/{settings.DRUG_REGISTRY_CANISTER_ID}/verify_hash",
                    params={"hash": batch_hash},
                    timeout=10.0
                )
                return response.json()
            except:
                return {"verified": False, "error": "ICP unreachable"}
    
    async def flag_counterfeit_on_chain(
        self, 
        batch_id: str, 
        reporter_principal: str, 
        verdict: str, 
        location: str, 
        evidence_hash: str
    ) -> Dict[str, Any]:
        """Record counterfeit alert on ICP"""
        if not settings.VERIFICATION_CANISTER_ID:
            return {"tx_id": f"mock-tx-{batch_id}", "stub": True}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.icp_url}/canister/{settings.VERIFICATION_CANISTER_ID}/flag_counterfeit",
                    json={
                        "batch_id": batch_id,
                        "reporter": reporter_principal,
                        "verdict": verdict,
                        "location": location,
                        "evidence_hash": evidence_hash
                    },
                    timeout=10.0
                )
                return response.json()
            except:
                return {"tx_id": None, "error": "ICP unreachable"}
    
    async def add_custody_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add custody event to supply chain canister"""
        if not settings.SUPPLY_CHAIN_CANISTER_ID:
            return {"event_id": f"mock-event-{event_data.get('batch_id')}", "stub": True}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.icp_url}/canister/{settings.SUPPLY_CHAIN_CANISTER_ID}/add_event",
                    json=event_data,
                    timeout=10.0
                )
                return response.json()
            except:
                return {"event_id": None, "error": "ICP unreachable"}

icp_service = ICPService()