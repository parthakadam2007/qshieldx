import os
import uuid
import datetime
import json
from typing import Optional, Dict, Any

# Set environment variable before importing tools to bypass CLI interactive prompts
os.environ["STREAMLIT"] = "1"

import config # This validates env vars and logs on startup

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage

from app import app as langgraph_agent
from services.supabase import DatabaseService
from services.discovery import DiscoveryService
from services.testssl import TestSSLService
from services.certificate_parser import CertificateParserService
from services.cryptofinder import CryptoFinderService
from services.semgrep_crypto import SemgrepCryptoService
from services.classifier import ClassifierService
from services.risk_engine import RiskEngineService
from services.cbom_builder import CBOMBuilderService
from services.agent_logger import AgentLogger

# Initialize FastAPI
api = FastAPI(
    title="🛡️ QShieldX Backend API",
    description="Backend API exposing the QShieldX cryptographic agents and discovery pipeline.",
    version="2.1.0"
)

DEMO_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "lib", "demo", "qshieldx-demo.json")


def load_demo_data() -> Dict[str, Any]:
    with open(DEMO_DATA_PATH, encoding="utf-8") as demo_file:
        return json.load(demo_file)

class ScanRequest(BaseModel):
    domain: str
    mode: str = "fast"

@api.get("/health")
def health_check():
    db_status = "connected" if os.environ.get("SUPABASE_URL") else "mock"
    llm_prov = "gemini" if os.environ.get("GEMINI_API_KEY") else ("openai" if os.environ.get("OPENAI_API_KEY") else "disabled")
    mock_mode = db_status == "mock" or llm_prov == "disabled"
    
    return {
        "status": "healthy",
        "service": "QShieldX Backend",
        "database": db_status,
        "llm_provider": llm_prov,
        "mock_mode": mock_mode,
        "version": "2.5.0"
    }


@api.get("/agent_activity")
@api.get("/api/agent_activity")
def agent_activity():
    demo = load_demo_data()
    return {"scan_id": demo["scan"]["id"], "status": demo["scan"]["status"], "agents": demo["scan"]["agentCount"], "timeline": [
        {"agent": "Planner Agent", "action": "Discovery plan initialized", "status": "completed", "timestamp": "11:02:04 IST"},
        {"agent": "Security Discovery Agent", "action": "27 subdomains discovered; TLS ports 443, 8443, 9443 detected", "status": "completed", "timestamp": "11:03:11 IST"},
        {"agent": "Classification Agent", "action": "128 cryptographic assets classified", "status": "completed", "timestamp": "11:04:03 IST"},
        {"agent": "Threat Intelligence Agent", "action": "Harvest-now-decrypt-later exposure assessed", "status": "completed", "timestamp": "11:04:52 IST"},
        {"agent": "Quantum Risk Agent", "action": "Mosca 92 and QARS 88 calculated for payment API", "status": "completed", "timestamp": "11:05:28 IST"},
        {"agent": "CBOM Agent", "action": "CycloneDX inventory generated with 45 components", "status": "completed", "timestamp": "11:06:15 IST"},
        {"agent": "Migration Planner Agent", "action": "Wave 1 migration plan completed", "status": "completed", "timestamp": "11:07:42 IST"}
    ]}


@api.get("/cbom")
@api.get("/api/cbom")
def cbom():
    return load_demo_data()["cbom"]


@api.get("/risk_scores")
@api.get("/api/risk_scores")
def risk_scores():
    return {"scan_id": load_demo_data()["scan"]["id"], "scores": load_demo_data()["quantumRisk"]}

@api.get("/")
def root():
    return {"status": "ok", "message": "QShieldX API is running."}

def run_async_pipeline(domain: str, mode: str, scan_id: str):
    """
    Background task to run the complete discovery, crypto-analysis, 
    classification, risk scoring, and CBOM generation pipeline.
    """
    logger = AgentLogger(scan_id)
    
    # Initialize transaction arrays
    db_scan_job = {
        "id": scan_id,
        "target_domain": domain,
        "status": "processing",
        "created_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
    db_assets = []
    db_findings = []
    db_risk_scores = []
    
    # 1. Discovery
    logger.log_activity("Discovery Agent", "Running subdomain and port discovery", "subfinder, nmap")
    discovery_results = DiscoveryService.run_recon_pipeline(domain, mode)
    
    for host_data in discovery_results.get("assets", []):
        subdomain = host_data["subdomain"]
        ports = host_data["ports"]
        
        # Determine if TLS is likely (443, 8443, etc)
        tls_enabled = any(p in ports for p in [443, 8443, 4433])
        
        asset_id = str(uuid.uuid4())
        base_asset = {
            "id": asset_id,
            "scan_id": scan_id,
            "domain": subdomain,
            "ip_address": "", # would resolve in deep mode
            "port": 443 if tls_enabled else (ports[0] if ports else 80),
            "tls_enabled": tls_enabled
        }
        
        raw_crypto_data = {}
        
        # 2. Cryptographic Scans
        if tls_enabled:
            logger.log_activity("Security Scanner", f"Running testssl on {subdomain}", "testssl.sh")
            testssl_res = TestSSLService.run_scan(subdomain, scan_id)
            if "error" not in testssl_res:
                raw_crypto_data["testssl"] = testssl_res
                
                # Mock extracting a cert from testssl to pass to cert parser
                logger.log_activity("Security Scanner", f"Parsing certificates for {subdomain}", "certificate_parser")
                cert_res = CertificateParserService.parse_certificate("-----BEGIN CERTIFICATE-----\nMock\n-----END CERTIFICATE-----")
                if "error" not in cert_res:
                    raw_crypto_data["cert"] = cert_res
                    
        # 3. Code Scans (Mocked against domain as target for this example)
        logger.log_activity("Security Scanner", f"Running cryptofinder on {subdomain}", "cryptofinder")
        cf_res = CryptoFinderService.run_scan(subdomain)
        if "error" not in cf_res:
            raw_crypto_data["cryptofinder"] = cf_res
            
        # 4. Classification
        logger.log_activity("Classification Agent", f"Classifying asset {subdomain}", "classifier")
        
        class_input = {
            "name": subdomain,
            "details": str(raw_crypto_data).lower()
        }
        classification = ClassifierService.classify(class_input)
        
        # Merge classification into asset
        asset = {**base_asset, **classification}
        db_assets.append(asset)
        
        # 5. Risk Scoring
        logger.log_activity("Quantum Risk Agent", f"Scoring risk for {subdomain}", "risk_engine")
        risk_score = RiskEngineService.calculate_risk(asset)
        
        db_risk_scores.append({
            "id": str(uuid.uuid4()),
            "asset_id": asset_id,
            "scan_id": scan_id,
            **risk_score
        })
        
        # Prepare findings
        if "testssl" in raw_crypto_data and "vulnerabilities" in raw_crypto_data["testssl"]:
            for vuln in raw_crypto_data["testssl"]["vulnerabilities"]:
                db_findings.append({
                    "id": str(uuid.uuid4()),
                    "scan_id": scan_id,
                    "asset_id": asset_id,
                    "vulnerability_name": vuln["finding"],
                    "severity": vuln["severity"]
                })
                
    # 6. CBOM Generation
    logger.log_activity("CBOM Agent", f"Building CBOM for {domain}", "cbom_builder")
    cbom_json = CBOMBuilderService.build_cyclonedx(db_assets, domain)
    
    cbom_report = {
        "id": str(uuid.uuid4()),
        "scan_id": scan_id,
        "components": cbom_json.get("components", []),
        "report_url": f"https://cbom.example.com/{scan_id}.json"
    }
    
    # 7. Persistence
    logger.log_activity("Persistence", "Committing transaction to Supabase", "supabase")
    db_scan_job["status"] = "completed"
    
    DatabaseService.persist_scan_transaction(
        scan_job=db_scan_job,
        assets=db_assets,
        findings=db_findings,
        risk_scores=db_risk_scores,
        cbom_report=cbom_report,
        activities=logger.get_activities()
    )


@api.post("/api/scan_domain_pipeline")
def scan_domain_pipeline(request: ScanRequest, background_tasks: BackgroundTasks):
    """
    Triggers the asynchronous QShieldX pipeline.
    """
    domain = request.domain.strip().lower()
    if domain.startswith("http://") or domain.startswith("https://"):
        import re
        domain = re.sub(r"^https?://", "", domain).split("/")[0]
        
    if not domain:
        raise HTTPException(status_code=400, detail="Domain cannot be empty.")

    if request.mode.lower() == "demo":
        demo = load_demo_data()
        return {"status": "completed", "scan_id": demo["scan"]["id"], "message": "Deterministic demo pipeline completed.", "summary": demo["scan"]}
        
    scan_id = str(uuid.uuid4())
    background_tasks.add_task(run_async_pipeline, domain, request.mode, scan_id)
    
    return {
        "status": "processing",
        "scan_id": scan_id,
        "message": "Scan pipeline started in the background."
    }

class PromptRequest(BaseModel):
    prompt: str
    thread_id: Optional[str] = None

@api.post("/api/chat")
def run_agent(request: PromptRequest):
    """
    Interact directly with the multi-agent LangGraph pipeline for ad-hoc analysis.
    """
    try:
        thread_id = request.thread_id or str(uuid.uuid4())
        config = {"configurable": {"thread_id": thread_id}}
        inputs = {"messages": [HumanMessage(content=request.prompt)]}
        
        # Log to Agent Activity (not tied to a specific scan here)
        logger = AgentLogger(scan_id=thread_id)
        logger.log_activity("Migration Planner Agent", "User chat interaction")
        
        state = langgraph_agent.invoke(inputs, config=config)
        final_message = state["messages"][-1]
        
        if isinstance(final_message, AIMessage):
            return {"response": final_message.content, "thread_id": thread_id}
        else:
            return {"response": "The agent did not return a valid response.", "thread_id": thread_id}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {str(e)}")