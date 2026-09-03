from typing import Dict, Any

class ClassifierService:
    @staticmethod
    def classify(asset_data: Dict[str, Any]) -> Dict[str, str]:
        """
        Classify discovered cryptographic assets into strict dimensions.
        """
        name = asset_data.get("name", "").lower()
        details = str(asset_data.get("details", "")).lower()
        
        # 1. Artifact Type
        artifact_type = "Algorithm"
        if "cert" in name or "pem" in name or "crt" in name:
            artifact_type = "Certificate"
        elif "key" in name or "secret" in name or "token" in name:
            artifact_type = "Secret"
        elif "tls" in name or "ssl" in name or "ssh" in name:
            artifact_type = "Protocol"
        elif "lib" in name or "bouncycastle" in name or "openssl" in name:
            artifact_type = "Library"
        elif "aws" in name or "azure" in name or "gcp" in name:
            artifact_type = "Cloud Service"
            
        # 2. Business Criticality (Heuristic)
        business_criticality = "Medium"
        if "prod" in name or "payment" in name or "auth" in name or "core" in name:
            business_criticality = "Critical"
        elif "api" in name or "gateway" in name or "db" in name:
            business_criticality = "High"
        elif "test" in name or "dev" in name or "sandbox" in name:
            business_criticality = "Low"
            
        # 3. Quantum Status
        quantum_status = "Vulnerable"
        if any(x in details for x in ["kyber", "dilithium", "sphincs", "ml-kem", "ml-dsa"]):
            if any(x in details for x in ["rsa", "ecc", "ecdsa"]):
                quantum_status = "Hybrid"
            else:
                quantum_status = "PQC Ready"
        elif any(x in details for x in ["md5", "sha1", "des", "rc4"]):
            quantum_status = "Deprecated"
            
        # 4. Base Lifetime (Years)
        lifetime_years = asset_data.get("lifetime_years", 1.0)
            
        return {
            "artifact_type": artifact_type,
            "business_criticality": business_criticality,
            "quantum_status": quantum_status,
            "lifetime_years": float(lifetime_years)
        }
