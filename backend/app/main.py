from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
import os

load_dotenv()

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

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")

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