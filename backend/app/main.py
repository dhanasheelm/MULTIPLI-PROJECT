from datetime import datetime

from fastapi import FastAPI

app = FastAPI(
    title="AegisMesh API",
    description="Web3 Security & Protocol Health Intelligence Platform",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {
        "product": "AegisMesh",
        "status": "operational",
        "service": "Web3 Security Intelligence API",
    }


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
    }