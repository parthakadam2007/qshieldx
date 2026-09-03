 # Test Run Guide

This document explains how to validate the full CyberScanner project on a fresh machine.

## 1) Pre-check

- OS: Windows
- Node.js installed (recommended 22+)
- Python installed (recommended 3.12+)
- MongoDB running and reachable

Quick checks:

```powershell
node -v
pnpm -v
python --version
```

## 2) Frontend Setup and Test

From workspace root:

```powershell
pnpm --dir frontend install
pnpm --dir frontend typecheck
pnpm --dir frontend dev
```

Expected:

- Typecheck finishes without errors
- Frontend starts on http://localhost:3000 (or next free port)

Health check:

```powershell
Invoke-WebRequest http://127.0.0.1:3000/api/global-data -UseBasicParsing
```

Expected: HTTP 200 with JSON payload.

## 3) Backend Setup and Test

Install Python dependencies (requirements first):

```powershell
python -m pip install -r backend/requirements.txt
python -m pip install fastapi uvicorn langchain-ollama pydantic pyttsx3 rich
```

Run backend API:

```powershell
python -m uvicorn --app-dir backend api:api --host 127.0.0.1 --port 8000
```

Health checks:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
$payload = @{ host = 'example.com' } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/get_ip -Method Post -ContentType application/json -Body $payload
```

Expected:

- Root endpoint returns status ok
- get_ip returns host and ip

## 4) Security Tool Availability Check

Run this in PowerShell:

```powershell
foreach($t in 'nmap','subfinder','httpx','nuclei','theHarvester','gitleaks','wafw00f','feroxbuster','shodan','assetfinder','naabu','waybackurls','gau','masscan'){
  "$t = $((Get-Command $t -ErrorAction SilentlyContinue) -ne $null)"
}
```

Notes:

- masscan may be missing on Windows and can be treated as optional for basic demo
- if any tool is missing, related scan stages may skip/fallback

## 5) End-to-End Smoke Test

With frontend and backend both running:

1. Open http://localhost:3000
2. Login/Register in UI
3. Open Targets page
4. Create a test target
5. Run scan from target details page
6. Verify assets, services, ports, topology pages show updated data

## 6) Common Issues and Fixes

### Port already in use

- Frontend: Next.js auto-shifts to another port
- Backend: stop process on 8000 or start on a different port

```powershell
Get-NetTCPConnection -LocalPort 8000 -State Listen | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

### tsconfig baseUrl warning

- baseUrl is deprecated under TypeScript 6 diagnostics
- keep alias via paths and do not use baseUrl

### Unauthorized (401) on frontend API routes

- these routes require authenticated session
- login first in UI before calling protected endpoints

## 7) Final Success Checklist

- Frontend typecheck passes
- Frontend UI opens
- Backend root endpoint returns ok
- get_ip endpoint returns IP
- Protected frontend routes work after login
- Scan updates target data in dashboard
