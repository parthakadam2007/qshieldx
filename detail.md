# Project Modules Overview

This document explains each module at a crisp level, how OOP concepts are used, and what each tool does.

## Backend (FastAPI + LangGraph)

### backend/api.py
- Purpose: FastAPI server that exposes API endpoints for chat, scanning, SSL testing, and IP resolution.
- Key responsibilities:
  - Defines request/response models (Pydantic).
  - Runs the LangGraph agent for chat.
  - Executes the bash-based recon pipeline (now via Git Bash on Windows).
  - Parses raw scan output into structured assets/ports/services.

### backend/app.py
- Purpose: LangGraph agent definition and CLI loop.
- Key responsibilities:
  - Builds agent state and tool graph.
  - Injects system prompt for agent behavior.
  - Streams tool calls and agent output.
  - Optional accessibility and TTS support.

### backend/web_app.py
- Purpose: Streamlit UI wrapper for the agent.
- Key responsibilities:
  - Provides chat UI for interactive prompts.
  - Shows tool call expansion and final responses.
  - Auto-approves shell commands in web mode.

### backend/sandbox/osint_tools.py
- Purpose: Tool wrappers for OSINT and system execution.
- Key responsibilities:
  - Defines tool functions callable by the agent.
  - Adds safe shell execution with blocklist.
  - Exposes tool list to LangGraph.

### backend/sandbox/tool_manager.py
- Purpose: Check and install external security tools.
- Key responsibilities:
  - Detects whether a CLI tool exists in PATH.
  - Provides OS-specific install commands (macOS/Linux).
  - Asks user approval before installing.

### backend/data/
- Purpose: Runtime storage for scan output (per-domain folders).

### backend/pyproject.toml, backend/requirements.txt
- Purpose: Python dependency definitions and runtime requirements.

## Frontend (Next.js App Router)

### frontend/app/layout.tsx
- Purpose: Root layout for the UI.
- Key responsibilities:
  - Composes providers (Auth, GlobalData, Theme, Tooltip, Sidebar).
  - Defines global metadata and fonts.

### frontend/app/page.tsx
- Purpose: Overview dashboard page.
- Key responsibilities:
  - High-level KPIs from global data.
  - Recent activity list.

### frontend/app/context/GlobalDataContext.tsx
- Purpose: Global data state for targets, assets, services, ports, topology.
- Key responsibilities:
  - Fetches /api/global-data and stores it.
  - Exposes refresh and setters to pages.

### frontend/app/targets/page.tsx
- Purpose: Target list and management page.
- Key responsibilities:
  - Search and filter targets.
  - Delete target and refresh global data.

### frontend/app/targets/[id]/page.tsx
- Purpose: Target detail page with agent chat and scans.
- Key responsibilities:
  - Runs agent scan via /api/agent/scan.
  - Runs analyst chat via /api/agent/chat.
  - Displays assets, ports, services for a target.

### frontend/app/assets/page.tsx
- Purpose: Paginated asset inventory.
- Key responsibilities:
  - Fetches paged assets via /api/global-data.
  - Search/filter and target switcher.

### frontend/app/assets/[id]/page.tsx
- Purpose: Asset detail page with SSL testing.
- Key responsibilities:
  - Loads asset and related ports/services.
  - Triggers /api/testssl to run SSL scan.

### frontend/app/services/page.tsx
- Purpose: Services inventory with risk and trends.
- Key responsibilities:
  - Fetches paged services via /api/global-data.
  - Expandable rows for per-asset view.

### frontend/app/ports/page.tsx
- Purpose: Ports inventory with grouped exposure.
- Key responsibilities:
  - Fetches paged ports via /api/global-data.
  - Expandable rows for affected assets.

### frontend/app/topology/page.tsx
- Purpose: Network topology visualization.
- Key responsibilities:
  - Builds graph from topology or assets/services.
  - Auto-layout and node rendering.

### frontend/app/settings/page.tsx
- Purpose: UI for settings and scan frequency.
- Key responsibilities:
  - Reads and writes /api/settings.
  - Local UI state for preferences.

### frontend/app/login/page.tsx and frontend/app/register/page.tsx
- Purpose: Authentication pages.
- Key responsibilities:
  - Sign in with NextAuth credentials.
  - Register new user via /api/register.

## Frontend API Routes (Next.js)

### frontend/app/api/global-data/route.ts
- Purpose: Aggregated and paged data from MongoDB.
- Key responsibilities:
  - Returns targets, assets, services, ports, topology.
  - Handles pagination and grouping for ports/services.

### frontend/app/api/targets/route.ts
- Purpose: Create targets.

### frontend/app/api/targets/[id]/route.ts
- Purpose: Delete target and cascade delete assets/ports/services/topology.

### frontend/app/api/agent/scan/route.ts
- Purpose: Proxy scan requests to backend /api/scan_domain_pipeline.
- Key responsibilities:
  - Validates role and target.
  - Writes assets, ports, services, topology into MongoDB.

### frontend/app/api/agent/chat/route.ts
- Purpose: Proxy analyst chat requests to backend /api/ollama/chat.

### frontend/app/api/testssl/route.ts
- Purpose: Proxy SSL scans to backend and persist results.

### frontend/app/api/ip/route.ts
- Purpose: Resolve IPs via backend /api/get_ip.

### frontend/app/api/settings/route.ts
- Purpose: Read/write scan frequency settings.

### frontend/app/api/register/route.ts
- Purpose: Create users with hashed passwords.

### frontend/app/api/auth/[...nextauth]/route.ts
- Purpose: NextAuth route handlers.

## Frontend Components

### frontend/components/app-sidebar.tsx
- Purpose: Sidebar shell and navigation container.

### frontend/components/nav-main.tsx
- Purpose: Main navigation list with active route logic.

### frontend/components/nav-user.tsx
- Purpose: User menu and logout.

### frontend/components/team-switcher.tsx
- Purpose: Team selector UI in sidebar.

### frontend/components/auth-provider.tsx
- Purpose: NextAuth session provider wrapper.

### frontend/components/theme-provider.tsx
- Purpose: Theme provider and hotkey toggle.

### frontend/components/ui/*
- Purpose: Reusable UI primitives (button, card, table, etc.).

## Frontend Libraries and Hooks

### frontend/lib/auth.ts
- Purpose: NextAuth configuration with MongoDB adapter.

### frontend/lib/mongodb.ts
- Purpose: Shared MongoDB client with dev hot-reload safety.

### frontend/lib/mock-data.ts
- Purpose: Mock data used for development or placeholders.

### frontend/lib/utils.ts
- Purpose: Utility helpers (className merging).

### frontend/hooks/use-mobile.ts
- Purpose: Detect mobile breakpoint for responsive behavior.

## OOP Concepts Used

- Encapsulation: Request/response models in backend (Pydantic classes) encapsulate validation and shape of inputs/outputs.
- Abstraction: Tool functions hide CLI details behind simple function calls (e.g., nmap_scan, subfinder_scan).
- Composition: React pages compose smaller components (Sidebar, Cards, Tables) and providers.
- Polymorphism: Node rendering in topology uses different node types (asset vs service) with shared interface shape.
- Separation of concerns: Backend agent, API layer, and UI are isolated modules with clear interfaces.

## Tool Purposes (OSINT and Pipeline)

### Agent Tool Wrappers (backend/sandbox/osint_tools.py)
- dns_lookup: Resolve a domain to an IP.
- get_ip_info: Geolocation and ISP info for an IP/domain.
- get_http_headers: Fetch HTTP headers to fingerprint servers.
- nmap_scan: Service and version detection on target.
- theharvester_scan: OSINT for emails and subdomains.
- masscan_scan: Fast port scanning across wide ranges.
- gitleaks_scan: Scan repos for secrets.
- nuclei_scan: Vulnerability template scanning.
- subfinder_scan: Subdomain enumeration.
- wafw00f_scan: Identify WAF presence.
- feroxbuster_scan: Content discovery for directories/files.
- shodan_query: Shodan search via CLI.
- check_tool_installed: Detect if a CLI tool is available.
- install_security_tool: Install missing tool (with approval).
- run_shell_command: Run arbitrary command with safeguards.

### Recon Pipeline Tools (backend/api.py)
- subfinder, assetfinder: Subdomain discovery.
- dnsx: Resolve discovered subdomains.
- httpx: Check live web services and fingerprints.
- naabu: Fast port discovery.
- nmap: Service detection in deep mode.
- gau, waybackurls: Historical URL collection.
- grep: Filter interesting endpoints from URLs.

## Notes
- Backend runs at http://127.0.0.1:8000 by default.
- Frontend runs at http://localhost:3000.

## Risk Scoring Logic (UI)
- Score scale: $0$ to $100$ (higher means more risk).
- Severity bands used in the UI:
  - Critical: score $\ge 75$.
  - Elevated: score $\ge 40$ and $< 75$.
  - Routine: score $< 40$.
- What Elevated means: a moderate-risk exposure that should be triaged and verified, but not an emergency. It usually indicates exposed services or ports that are common and potentially risky (for example, externally reachable admin or remote-access services).
- Where scores come from:
  - Services use `riskScore` from stored scan data (or a default when missing).
  - Ports use a `severity` derived from port state and metadata (open ports default higher than closed/unknown).
  - Assets compute a simple exposure indicator based on the number of related open ports.

## How Risk Is Analyzed
- Data inputs: discovered assets, open ports, and services from the scan pipeline and stored in MongoDB.
- Mapping rules:
  - Each open port is mapped to a known service name using a common port dictionary.
  - Services are grouped globally by name; ports are grouped by port+protocol.
- Scoring logic in the UI:
  - Ports: open ports are treated as higher exposure by default; closed/unknown are lower.
  - Services: risk uses the stored `riskScore` (or defaults) and is visualized with trend sparklines.
  - Assets: exposure is approximated from the count of related open ports and shown as a simple rating.
- Result: the UI aggregates these scores into severity bands (Routine, Elevated, Critical) and highlights higher risk items first.
