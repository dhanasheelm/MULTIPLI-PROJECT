#MULTIPLI PROJECT
# AegisMesh

AegisMesh is a Web3 security monitoring dashboard for Ethereum Mainnet. It provides live RPC health checks, transaction analysis, Chainlink oracle monitoring, and front-running monitoring.

## Features

- Ethereum Mainnet RPC connection through Alchemy
- Live transaction analysis
- Chainlink ETH/USD oracle status
- Oracle freshness and anomaly monitoring
- Latest-block front-running monitoring
- Security dashboard with live status cards

## Requirements

Install these before running the project:

- Python 3.11 or newer
- Node.js 18 or newer
- An Alchemy Ethereum Mainnet HTTPS RPC URL
- An Etherscan API key

## Clone the repository

```powershell
git clone YOUR_GITHUB_REPOSITORY_URL
cd MULTIPLI-PROJECT
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the repository URL.

## Configure environment variables

Create this file:

```text
backend/.env
```

Add:

```env
ALCHEMY_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

Replace both placeholders with your own keys.

Never commit `.env` or expose API keys in screenshots, repositories, or public documentation.

## Start the backend

Open a terminal in the project root:

```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

The backend runs at:

```text
http://127.0.0.1:8000
```

Wait until the terminal shows:

```text
Application startup complete.
```

## Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The dashboard runs at:

```text
http://localhost:3000
```

Open that URL in a browser.

## API endpoints

| Endpoint | Purpose |
|---|---|
| `GET /` | Backend health check |
| `GET /api/health` | API health status |
| `GET /api/web3` | Ethereum RPC connection status |
| `GET /api/web3/block` | Latest Ethereum block information |
| `GET /api/web3/transactions` | Latest block transactions |
| `GET /api/web3/analyze` | Transaction risk analysis |
| `GET /api/web3/oracle` | Chainlink ETH/USD oracle status |
| `GET /api/web3/frontrunning` | Latest-block front-running monitor |

## Verify the installation

After starting the backend, test:

```text
http://127.0.0.1:8000/api/web3
```

A successful response should contain:

```json
{
  "status": "connected",
  "network": "Ethereum Mainnet"
}
```

Then verify:

```text
http://127.0.0.1:8000/api/web3/oracle
http://127.0.0.1:8000/api/web3/frontrunning
```

Finally open:

```text
http://localhost:3000
```

## Troubleshooting

### Ethereum RPC connection failed

Check that:

- `backend/.env` exists
- `ALCHEMY_RPC_URL` is spelled correctly
- The URL is an Ethereum Mainnet HTTPS endpoint
- The Alchemy key is active
- The backend was restarted after changing `.env`

### Port 8000 is already in use

Stop the existing backend with:

```text
Ctrl+C
```

Then restart it:

```powershell
python -m uvicorn app.main:app --reload
```

### Port 3000 is already in use

Stop the existing frontend with:

```text
Ctrl+C
```

Then restart it:

```powershell
npm run dev
```

## Security note

The application only provides monitoring, analysis, alerts, and recommendations. It does not automatically block transactions or guarantee prevention of attacks.

Keep all API keys in local environment files and rotate them immediately if they are exposed.
