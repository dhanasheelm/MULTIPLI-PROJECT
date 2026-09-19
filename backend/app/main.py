from datetime import datetime
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from web3 import Web3
load_dotenv()

ALCHEMY_RPC_URL = os.getenv("ALCHEMY_RPC_URL")

w3 = Web3(Web3.HTTPProvider(ALCHEMY_RPC_URL))

app = FastAPI(
    title="AegisMesh API",
    description="Web3 Security & Protocol Health Intelligence Platform",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.get("/api/dashboard")
async def dashboard():
    return {
        "risk_score": 87,
        "active_threats": 4,
        "exposure": 2400000,
        "protocol_health": 72,
        "threat_level": "HIGH",
        "incidents": [
            {
                "title": "Oracle Price Deviation",
                "severity": "CRITICAL",
                "description": "12.8% deviation detected",
            },
            {
                "title": "Whale Accumulation",
                "severity": "HIGH",
                "description": "$820K moved into target protocol",
            },
            {
                "title": "Admin Parameter Change",
                "severity": "HIGH",
                "description": "Protocol parameter modified",
            },
        ],
    }
@app.get("/api/web3")
async def web3_status():
    if not w3.is_connected():
        return {
            "status": "error",
            "message": "Ethereum RPC connection failed",
        }

    block_number = w3.eth.block_number

    return {
        "status": "connected",
        "network": "Ethereum Mainnet",
        "latest_block": block_number,
    }