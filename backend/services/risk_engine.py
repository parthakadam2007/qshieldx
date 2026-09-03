from typing import Dict, Any

class RiskEngineService:
    @staticmethod
    def calculate_risk(asset: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates Quantum Risk based on the Mosca Equation and QARS score.
        Mosca: D + T >= Q
        D = Time to maintain data security (shelf life)
        T = Time to migrate
        Q = Time until CRQC (Cryptographically Relevant Quantum Computer)
        """
        
        # Base parameters
        Q = 7.0 # Estimated years to CRQC (e.g. 2030)
        
        # Derive D (shelf life) from business criticality
        criticality = asset.get("business_criticality", "Medium")
        D_map = {"Critical": 10.0, "High": 7.0, "Medium": 3.0, "Low": 1.0}
        D = D_map.get(criticality, 3.0)
        
        # Derive T (migration time) from artifact type
        artifact_type = asset.get("artifact_type", "Algorithm")
        T_map = {
            "Protocol": 2.0,
            "Library": 1.5,
            "Certificate": 0.5,
            "Secret": 0.1,
            "Algorithm": 3.0,
            "Cloud Service": 1.0
        }
        T = T_map.get(artifact_type, 2.0)
        
        # Mosca Equation logic: Is risk active?
        mosca_risk_active = (D + T) >= Q
        
        # Calculate QARS (Quantum Attack Readiness Score) 0-100
        # 100 = Safe, 0 = Extremely Vulnerable
        q_status = asset.get("quantum_status", "Vulnerable")
        if q_status == "PQC Ready":
            qars = 100
        elif q_status == "Hybrid":
            qars = 80
        elif q_status == "Vulnerable":
            qars = max(0, 100 - ((D + T) / Q) * 100)
        elif q_status == "Deprecated":
            qars = 0
        else:
            qars = 50
            
        qars = round(qars)
        
        # Determine Migration Priority
        if q_status == "Deprecated" or (mosca_risk_active and qars < 30):
            priority = "Immediate"
        elif mosca_risk_active and qars < 60:
            priority = "High"
        elif mosca_risk_active:
            priority = "Medium"
        else:
            priority = "Low"
            
        return {
            "mosca_d": D,
            "mosca_t": T,
            "mosca_q": Q,
            "mosca_threat_active": mosca_risk_active,
            "qars_score": qars,
            "migration_priority": priority
        }
