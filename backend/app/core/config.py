from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # App
    APP_NAME: str = "PharmChain API"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/pharmachain.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # ICP
    ICP_URL: str = "http://localhost:4943"
    ICP_IDENTITY_PEM: Optional[str] = None
    DRUG_REGISTRY_CANISTER_ID: str = ""
    SUPPLY_CHAIN_CANISTER_ID: str = ""
    VERIFICATION_CANISTER_ID: str = ""
    
    # AI Service
    AI_SERVICE_URL: str = "http://ai_service:8001"
    AI_CONFIDENCE_THRESHOLD: float = 0.75
    
    # QR
    QR_BASE_URL: str = "https://verify.pharmachain.com"
    QR_CODE_STORAGE_PATH: str = "/app/qr_codes"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"

settings = Settings()