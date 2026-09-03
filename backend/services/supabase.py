import os
from typing import Dict, Any, List
from supabase import create_client, Client

def get_supabase() -> Client:
    url: str = os.environ.get("SUPABASE_URL", "")
    key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    return create_client(url, key)

class DatabaseService:
    @staticmethod
    def persist_scan_transaction(
        scan_job: Dict[str, Any],
        assets: List[Dict[str, Any]],
        findings: List[Dict[str, Any]],
        risk_scores: List[Dict[str, Any]],
        cbom_report: Dict[str, Any],
        activities: List[Dict[str, Any]]
    ):
        """
        Persists data in correct order. If any step fails, we log it.
        (Since Supabase python client lacks multi-table transactions via PostgREST,
        we do consecutive inserts).
        """
        db = get_supabase()
        
        # 1. scan_jobs
        if scan_job:
            # We assume it already exists and we might just need to update status
            db.table("scan_jobs").upsert(scan_job).execute()
            
        # 2. assets
        if assets:
            db.table("assets").upsert(assets).execute()
            
        # 3. findings
        if findings:
            db.table("findings").insert(findings).execute()
            
        # 4. risk_scores
        if risk_scores:
            db.table("risk_scores").insert(risk_scores).execute()
            
        # 5. cbom_reports
        if cbom_report:
            db.table("cbom_reports").insert(cbom_report).execute()
            
        # 6. agent_activity
        if activities:
            db.table("agent_activity").insert(activities).execute()
            
        return True
