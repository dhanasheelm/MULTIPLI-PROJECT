from fastapi.staticfiles import StaticFiles
from datetime import datetime
import os
from pathlib import Path

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
ORACLE_ABI = [
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "description",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "latestRoundData",
        "outputs": [
            {"internalType": "uint80", "name": "roundId", "type": "uint80"},
            {"internalType": "int256", "name": "answer", "type": "int256"},
            {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
            {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
            {"internalType": "uint80", "name": "answeredInRound", "type": "uint80"},
        ],
        "stateMutability": "view",
        "type": "function",
    },
]

ETH_USD_ORACLE = Web3.to_checksum_address(
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
)

oracle = w3.eth.contract(
    address=ETH_USD_ORACLE,
    abi=ORACLE_ABI
)
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


@app.get("/api/web3/block")
async def latest_block():
    if not w3.is_connected():
        return {
            "status": "error",
            "message": "Ethereum RPC connection failed",
        }

    block_number = w3.eth.block_number
    block = w3.eth.get_block(block_number)

    return {
        "status": "connected",
        "network": "Ethereum Mainnet",
        "block_number": block_number,
        "timestamp": block["timestamp"],
        "transaction_count": len(block["transactions"]),
        "gas_used": block["gasUsed"],
        "gas_limit": block["gasLimit"],
    }


@app.get("/api/web3/transactions")
async def latest_transactions():
    if not w3.is_connected():
        return {
            "status": "error",
            "message": "Ethereum RPC connection failed",
        }

    block_number = w3.eth.block_number
    block = w3.eth.get_block(block_number, full_transactions=True)

    transactions = []

    for tx in block["transactions"][:10]:
        transactions.append({
            "hash": tx["hash"].hex(),
            "from": tx["from"],
            "to": tx["to"],
            "value_eth": float(w3.from_wei(tx["value"], "ether")),
            "gas": tx["gas"],
        })

    return {
        "status": "connected",
        "network": "Ethereum Mainnet",
        "block_number": block_number,
        "transaction_count": len(block["transactions"]),
        "transactions": transactions,
    }


@app.get("/api/web3/oracle")
async def oracle_status():

    if not w3.is_connected():
        return {
            "status": "error",
            "message": "Ethereum RPC connection failed",
        }

    try:
        decimals = oracle.functions.decimals().call()

        (
            round_id,
            answer,
            started_at,
            updated_at,
            answered_in_round,
        ) = oracle.functions.latestRoundData().call()

        price = answer / (10 ** decimals)

        current_block = w3.eth.block_number

        age_seconds = int(datetime.utcnow().timestamp()) - updated_at

        deviation_threshold = 0.5

        if age_seconds > 3600:
            anomaly = True
            severity = "HIGH"
            signal = "STALE_ORACLE_DATA"

        elif price <= 0:
            anomaly = True
            severity = "CRITICAL"
            signal = "INVALID_ORACLE_PRICE"

        else:
            anomaly = False
            severity = "LOW"
            signal = "NORMAL"

        return {
            "status": "connected",
            "network": "Ethereum Mainnet",
            "oracle": "Chainlink ETH/USD",
            "oracle_address": ETH_USD_ORACLE,
            "price_usd": round(price, 2),
            "round_id": round_id,
            "updated_at": updated_at,
            "age_seconds": age_seconds,
            "deviation_threshold_percent": deviation_threshold,
            "anomaly_detected": anomaly,
            "severity": severity,
            "signal": signal,
            "block_number": current_block,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }


@app.get("/api/web3/analyze")
async def analyze_transactions():
    if not w3.is_connected():
        return {
            "status": "error",
            "message": "Ethereum RPC connection failed",
        }

    block_number = w3.eth.block_number
    block = w3.eth.get_block(block_number, full_transactions=True)

    analyzed = []

    for tx in block["transactions"][:10]:
        value_eth = float(w3.from_wei(tx["value"], "ether"))

        signals = []
        risk_score = 0

        if value_eth >= 10:
            signals.append("HIGH_VALUE_TRANSFER")
            risk_score += 30

        if tx["gas"] >= 500000:
            signals.append("HIGH_GAS_USAGE")
            risk_score += 20

        if tx["to"] is None:
            signals.append("CONTRACT_CREATION")
            risk_score += 15

        if tx["input"] and tx["input"] != "0x":
            signals.append("CONTRACT_INTERACTION")
            risk_score += 10

        if risk_score >= 40:
            risk_level = "HIGH"
        elif risk_score >= 20:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        analyzed.append({
            "hash": tx["hash"].hex(),
            "from": tx["from"],
            "to": tx["to"],
            "value_eth": value_eth,
            "gas": tx["gas"],
            "risk_score": risk_score,
            "risk_level": risk_level,
            "signals": signals,
        })

    return {
        "status": "connected",
        "network": "Ethereum Mainnet",
        "block_number": block_number,
        "analyzed_transactions": len(analyzed),
        "transactions": analyzed,
    }


@app.get("/api/web3/frontrunning")
async def frontrunning_status():
    if not w3.is_connected():
        return {
            "status": "error",
            "message": "Ethereum RPC connection failed",
        }

    block_number = w3.eth.block_number
    block = w3.eth.get_block(block_number)

    return {
        "status": "connected",
        "network": "Ethereum Mainnet",
        "block_number": block_number,
        "transactions_scanned": len(block["transactions"]),
        "potential_sandwich_attacks": 0,
        "signal": "MONITORING",
        "recommendation": "Use lower slippage and protected transaction routing.",
    }


FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")