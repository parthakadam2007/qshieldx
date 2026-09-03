import datetime
from typing import Dict, Any, List

class AgentLogger:
    def __init__(self, scan_id: str):
        self.scan_id = scan_id
        self.activities = []

    def log_activity(
        self, 
        agent_name: str, 
        action: str, 
        tool_used: str = None,
        runtime_ms: int = 0,
        confidence: float = 1.0,
        payload_reference: str = None
    ):
        """
        Logs an individual agent execution event.
        """
        activity = {
            "scan_id": self.scan_id,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "agent_name": agent_name,
            "action": action,
            "tool_used": tool_used,
            "runtime_ms": runtime_ms,
            "confidence": confidence,
            "payload_reference": payload_reference
        }
        self.activities.append(activity)
        
    def get_activities(self) -> List[Dict[str, Any]]:
        return self.activities
