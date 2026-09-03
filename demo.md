# Demo Script

Use this script to present the project confidently in 8 to 12 minutes.

## 1) Demo Goal

Show that CyberScanner can:

- Manage targets
- Run reconnaissance pipeline
- Store findings
- Visualize assets, services, ports, and topology
- Provide AI-assisted analysis

## 2) Before Audience Joins

Start backend in one terminal:

```powershell
python -m uvicorn --app-dir backend api:api --host 127.0.0.1 --port 8000
```

Start frontend in second terminal:

```powershell
pnpm --dir frontend dev
```

Open UI in browser:

- http://localhost:3000

Quick backend check:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
```

## 3) Live Presentation Flow

### Step A: Introduction (1 minute)

Say:

- This is a cyber infrastructure dashboard with an AI-assisted recon backend.
- Frontend is Next.js, backend is FastAPI plus LangGraph tools.

### Step B: Authentication (1 minute)

- Open login/register page
- Sign in to show access-controlled workflow

### Step C: Target Lifecycle (2 minutes)

- Go to Targets
- Create a new target
- Open target details page

Talk track:

- Each target becomes a monitoring scope for reconnaissance and risk mapping.

### Step D: Recon Trigger (2 minutes)

- Select scan mode (fast/medium/deep)
- Click Vulnerability Scan
- Explain live progress and logs

Talk track:

- Backend orchestrates tool chain and normalizes data into assets, ports, services, topology.

### Step E: Data Views (2 to 3 minutes)

Navigate and show:

- Assets page
- Services page
- Ports page
- Topology page

Talk track:

- Same target data is visualized in multiple operational lenses.

### Step F: AI Analyst Chat (1 to 2 minutes)

- Ask a security question in target page chat
- Show response grounded in target context

Example prompt:

- Which exposures are highest priority and what should we remediate first?

## 4) Demo Backup Plan (If Scan Is Slow)

If tools/network are slow, do this:

1. Use an already-scanned target in DB
2. Open Assets, Ports, Services, and Topology directly
3. Show backend health endpoint returning ok
4. Continue with AI analysis on existing data

## 5) Q and A Cheat Sheet

### Q: Is this production-ready?

Answer:

- It is a strong prototype with real integrations. For production, we add hardened auth policy, deeper observability, and deployment automation.

### Q: What if some OSINT tools are missing?

Answer:

- The pipeline can partially run, and missing tools can be installed incrementally.

### Q: How does security work?

Answer:

- Sensitive operations are behind authenticated routes, and backend actions are API-mediated.

## 6) Closing Statement

- CyberScanner unifies reconnaissance, data normalization, and analyst workflow in one practical interface.
- It reduces manual effort and speeds up security triage from discovery to action.
