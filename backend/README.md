# 💀 QSHIELDX Hacker Agent

**An autonomous, elite white-hat cyber security expert and hacker AI powered by LangGraph and Ollama.**

This interactive CLI agent assists security professionals and researchers in deep reconnaissance, penetration testing, network scanning, threat intelligence, and custom scripting. It leverages local AI models (via Ollama) to ensure privacy while providing powerful autonomous capabilities.

---

## 🚀 Features

*   **Autonomous Reconnaissance:** Automatically selects and runs the right tools based on your target and objectives.
*   **Rich CLI Interface:** Includes a beautiful terminal UI with status spinners, markdown formatting, and color-coding powered by `rich`.
*   **Local AI (Privacy-First):** Uses Ollama models (e.g., `llama3.2`, `qwen2.5`) to process data locally. No cloud API keys required!
*   **Built-in OSINT Tools:**
    *   DNS Lookups & IP Geolocation
    *   HTTP Headers Fingerprinting
    *   Nmap (Port & Service Scanning)
    *   theHarvester (Emails & Subdomains)
    *   Masscan (Fast Port Scanning)
    *   Nuclei (Vulnerability Scanning)
    *   Gitleaks (Secrets Detection in Repos)
    *   Subfinder (Subdomain Enumeration)
    *   WafW00f (WAF Fingerprinting)
    *   Feroxbuster (Directory/Content Discovery)
    *   Shodan (Internet-facing device mapping)
*   **Arbitrary Shell Execution (with Safeguards!) 🛡️:** The agent can write and execute its own shell scripts or use tools not explicitly coded into the framework.
    *   **User Approval:** Like GitHub Copilot or VS Code agents, it will **prompt you for permission** before running any shell commands.
    *   **Hard-coded Guardrails:** Automatically blocks destructive commands (e.g., `rm -rf`, `mkfs`, `halt`).

---

## ♿ Accessibility

The agent is designed to be accessible to all users, including those using screen readers or those who require high-contrast plain text.

*   `--accessible`: Disables terminal animations, spinners, Markdown rendering panels, and colored ANSI text. This ensures compatibility with VoiceOver, NVDA, and JAWS.
*   `--tts`: Enables local Text-to-Speech (TTS). The agent will read its answers aloud, automatically stripping markdown syntax and emojis to ensure clear pronunciation.

```bash
uv run app.py --accessible --tts
```

---

1.  **Python 3.12+**
2.  **uv** (Python package manager, recommended)
3.  **Ollama** installed and running locally.
    *   Download from: [https://ollama.com/](https://ollama.com/)
    *   Pull a model that supports tool calling (e.g., `llama3.2`):
        ```bash
        ollama pull llama3.2
        ```
4.  **CLI Tools (Optional but highly recommended):**
    For the agent to use its extended toolset, ensure the following are installed and accessible in your system's `PATH`:
    *   `nmap`
    *   `masscan`
    *   `nuclei`
    *   `subfinder`
    *   `theHarvester`
    *   `gitleaks`
    *   `wafw00f`
    *   `feroxbuster`
    *   `shodan` (requires an API key configured via `shodan init <API_KEY>`)

---

## 📦 Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <your-repo-url>
   cd cyb
   ```

2. Sync the dependencies using `uv` (or pip):
   ```bash
   # If you have uv installed:
   uv sync
   
   # Or manually:
   pip install -r requirements.txt
   ```

---

## 🌐 Remote VPS Merge (Coverage Boost)

For protected targets (banks, gov, enterprise), local scans can miss subdomains/ports due to ASN/geolocation filtering.
You can enable automatic merge from a second vantage point (VPS) without changing frontend code.

### Environment Variables

Set these for the backend process:

```bash
REMOTE_SCAN_PROVIDER_URL=https://<your-vps-or-worker>/api/scan_domain_pipeline
REMOTE_SCAN_PROVIDER_TOKEN=<optional-bearer-token>
REMOTE_SCAN_PROVIDER_TIMEOUT_SEC=40

### Premium Passive API Keys (optional)

To improve passive discovery coverage without deploying a remote VPS, you can configure paid OSINT providers. Set any of the following environment variables to enable them:

```bash
SECURITYTRAILS_API_KEY=<your_securitytrails_api_key>
SHODAN_API_KEY=<your_shodan_api_key>
CENSYS_API_ID=<your_censys_api_id>
CENSYS_API_SECRET=<your_censys_api_secret>
```

When provided, the backend will call these providers during passive enrichment and merge discovered subdomains into the final asset list. Provider-specific counts are exposed under `provider_stats` in the API response.
```

### Expected Remote API Contract

Remote endpoint should accept:

```json
{ "domain": "example.com", "mode": "fast" }
```

And return at least:

```json
{
    "domain": "example.com",
    "assets": [
        { "subdomain": "api.example.com", "ports": [443] }
    ]
}
```

### What Gets Merged

- New subdomains from the remote provider are merged into local results.
- New open ports from remote assets are merged into local port maps.
- Response now includes `provider_stats` and `remote_provider` diagnostics to verify merge behavior.

---

## 🕹️ Usage

1. Start the Ollama service in the background (if not already running):
   ```bash
   ollama serve
   ```

2. Run the agent:
   ```bash
   uv run app.py
   ```

3. Type your prompt into the CLI. For example:
   * *"Do a quick DNS and IP lookup on example.com"*
   * *"Scan scanme.nmap.org for open web ports and tell me what server they are running."*
   * *"Run subfinder on target.com and checking if any discovered subdomains are using a WAF."*
   * *"Write a python script to check if port 8080 is open on localhost and execute it."*

---

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    User["👤 User/Client"]
    CLI["🖥️ CLI Interface<br/>web_app.py"]
    API["⚙️ FastAPI Server<br/>api.py"]
    Agent["🤖 LangGraph Agent<br/>app.py"]
    Model["🧠 Ollama LLM<br/>qwen3:1.7b"]
    Tools["🛠️ Tool Suite<br/>sandbox/"]
    Data["📁 Data Storage<br/>data/"]
    
    User -->|interactive prompts| CLI
    User -->|HTTP requests| API
    
    CLI -->|invoke| Agent
    API -->|invoke via thread| Agent
    
    Agent -->|calls| Model
    Model -->|binds tools| Tools
    Tools -->|executes commands| CLI
    Tools -->|reads/writes| Data
    
    API -->|bash scripts| Tools
    API -->|json output| User
```

### LangGraph Agent Workflow

```mermaid
graph TD
    Start["START"]
    Input["📥 User Input/Prompt"]
    SystemPrompt["🔧 System Message<br/>- Elite Hacker AI<br/>- Autonomous OSINT<br/>- Execution Safeguards"]
    ModelCall["🧠 Call LLM Model"]
    ToolCheck{"Tool Execution<br/>Needed?"}
    ToolExec["🛠️ Execute Tools<br/>- OSINT Tools<br/>- Shell Commands<br/>- DNS/Network"]
    ToolResult["📊 Tool Output"]
    End["✅ Final Response<br/>to User"]
    
    Start --> Input
    Input --> SystemPrompt
    SystemPrompt --> ModelCall
    ModelCall --> ToolCheck
    ToolCheck -->|No| End
    ToolCheck -->|Yes| ToolExec
    ToolExec --> ToolResult
    ToolResult --> ModelCall
```

### Tool Architecture

```mermaid
graph LR
    Agent["🤖 Agent"]
    
    Tools["🛠️ Tool Extensions"]
    
    Built["Built-in Tools"]
    OSINT["OSINT Tools"]
    Shell["Shell Execution"]
    
    DL["dns_lookup"]
    GII["get_ip_info"]
    Headers["get_http_headers"]
    
    SF["subfinder_scan"]
    TH["theharvester_scan"]
    FB["feroxbuster_scan"]
    NM["nmap_scan"]
    MS["masscan_scan"]
    NUC["nuclei_scan"]
    GL["gitleaks_scan"]
    WF["wafw00f_scan"]
    SH["shodan_search"]
    
    SE["shell_execute"]
    SW["write_script"]
    
    Agent --> Tools
    Tools --> Built
    Tools --> OSINT
    Tools --> Shell
    
    Built --> DL
    Built --> GII
    Built --> Headers
    
    OSINT --> SF
    OSINT --> TH
    OSINT --> FB
    OSINT --> NM
    OSINT --> MS
    OSINT --> NUC
    OSINT --> GL
    OSINT --> WF
    OSINT --> SH
    
    Shell --> SE
    Shell --> SW
```

### API Endpoints Architecture

```mermaid
graph TD
    FastAPI["⚙️ FastAPI<br/>Port 8000"]
    
    Health["GET /"]
    Chat["POST /api/chat"]
    Scan["POST /api/scan_domain_pipeline"]
    SSL["POST /api/testssl"]
    Ollama["POST /api/ollama/chat"]
    GetIP["POST /api/get_ip"]
    
    HealthLogic["Health Check"]
    ChatLogic["LangGraph Agent Invocation<br/>Thread-based Memory"]
    ScanLogic["Async Bash Recon Pipeline<br/>Subfinder + Httpx + Nmap"]
    SSLLogic["TestSSL.sh Integration<br/>JSON Output"]
    OllamaLogic["Direct Ollama Interface<br/>With Context Support"]
    GetIPLogic["DNS Resolution<br/>dig + parsing"]
    
    FastAPI --> Health
    FastAPI --> Chat
    FastAPI --> Scan
    FastAPI --> SSL
    FastAPI --> Ollama
    FastAPI --> GetIP
    
    Health --> HealthLogic
    Chat --> ChatLogic
    Scan --> ScanLogic
    SSL --> SSLLogic
    Ollama --> OllamaLogic
    GetIP --> GetIPLogic
```

### Data Flow - Domain Scan

```mermaid
graph LR
    Domain["🎯 Domain Input"]
    Snap["Subdomain Enumeration<br/>subfinder + assetfinder"]
    DNS["DNS Resolution<br/>dnsx"]
    HTTP["HTTP Detection<br/>httpx"]
    Port["Port Scanning<br/>naabu + nmap"]
    Service["Service Detection<br/>nmap -sV"]
    URL["URL Collection<br/>gau + wayback"]
    Filter["Sensitive Endpoint<br/>Filtering"]
    Output["📊 Structured JSON<br/>Assets + Ports + Services"]
    
    Domain --> Snap
    Snap --> DNS
    DNS --> HTTP
    HTTP --> Port
    Port --> Service
    Service --> URL
    URL --> Filter
    Filter --> Output
```

### Request Model Architecture

```mermaid
graph TD
    Requests["📋 Request Models"]
    
    PR["PromptRequest<br/>- prompt: str<br/>- thread_id: Optional"]
    SR["ScanRequest<br/>- domain: str<br/>- mode: fast/medium/deep"]
    TR["TestSSLRequest<br/>- host: str<br/>- port: int"]
    CR["ChatRequest<br/>- prompt: str<br/>- model: str<br/>- context: Optional"]
    GR["GetIPRequest<br/>- host: str"]
    
    Responses["📤 Response Models"]
    
    PRsp["PromptResponse<br/>- response: str<br/>- thread_id: str"]
    CRsp["ChatResponse<br/>- response: str<br/>- model: str<br/>- prompt: str"]
    
    Requests --> PR
    Requests --> SR
    Requests --> TR
    Requests --> CR
    Requests --> GR
    
    Responses --> PRsp
    Responses --> CRsp
```

### Directory Structure

```
cyb/
├── 📄 api.py                    # FastAPI Backend Server
├── 📄 app.py                    # LangGraph Agent Definition
├── 📄 web_app.py               # Streamlit Web Interface
├── 📄 requirements.txt          # Dependencies
├── 📄 pyproject.toml            # Project Config
├── 📁 sandbox/
│   ├── 📄 osint_tools.py        # OSINT Tool Definitions
│   └── 📄 tool_manager.py       # Tool Installation & Validation
├── 📁 data/
│   ├── recon-{domain}/          # Scan Results per Domain
│   │   ├── subs.txt             # Discovered Subdomains
│   │   ├── live.txt             # Live Hosts
│   │   ├── ports.txt            # Open Ports
│   │   ├── nmap.txt             # Service Detection
│   │   ├── hosts.txt            # Resolved IPs
│   │   └── action/              # Action-specific Data
│   └── ...
└── 📁 .venv/                    # Virtual Environment
```

---

## ⚠️ Disclaimer

This tool is intended for **authorized auditing and educational purposes only**. You must have explicit permission to scan, footprint, or test the targets you provide. Do not use this tool to attack infrastructure or networks you do not own or have written authorization to test.

*The author of this repository is not responsible for any misuse or damage caused by this software.*