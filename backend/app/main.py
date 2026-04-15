from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from app.core.config import settings
from app.core.database import create_tables
from app.routers import auth, drugs, verify, shipments, alerts, analytics

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    Path(settings.QR_CODE_STORAGE_PATH).mkdir(parents=True, exist_ok=True)
    yield

app = FastAPI(title="PharmChain API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static/qr", StaticFiles(directory=settings.QR_CODE_STORAGE_PATH), name="qr")

app.include_router(auth.router)
app.include_router(drugs.router)
app.include_router(verify.router)
app.include_router(shipments.router)
app.include_router(alerts.router)
app.include_router(analytics.router)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "pharmachain-backend"}