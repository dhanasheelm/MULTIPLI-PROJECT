from datetime import datetime
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from web3 import Web3
import requests

load_dotenv()

ALCHEMY_RPC_URL = os.getenv("ALCHEMY_RPC_URL")
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")

w3 = Web3(Web3.HTTPProvider(ALCHEMY_RPC_URL))

app = FastAPI(
    title="AegisMesh API",
    description="Web3 Security & Protocol Health Intelligence Platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary in-memory user store — resets when the server restarts
users = {}


class AuthRequest(BaseModel):
    email: str
    password: str


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


@app.post("/signup")
def signup(data: AuthRequest):
    if data.email in users:
        return {"success": False, "error": "Account already exists — try logging in."}
    users[data.email] = data.password
    return {"success": True}


@app.post("/login")
def login(data: AuthRequest):
    if users.get(data.email) != data.password:
        return {"success": False, "error": "Invalid email or password."}
    return {"success": True}


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