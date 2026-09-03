import uuid
import datetime
from typing import Dict, List, Any

class CBOMBuilderService:
    @staticmethod
    def build_cyclonedx(assets: List[Dict[str, Any]], target: str) -> Dict[str, Any]:
        """
        Build a deterministic CycloneDX 1.7 compliant CBOM purely in Python.
        """
        
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        serial_number = f"urn:uuid:{uuid.uuid4()}"
        
        cbom = {
            "bomFormat": "CycloneDX",
            "specVersion": "1.7",
            "serialNumber": serial_number,
            "version": 1,
            "metadata": {
                "timestamp": timestamp,
                "tools": [
                    {
                        "vendor": "QShieldX",
                        "name": "CBOM Builder",
                        "version": "1.0.0"
                    }
                ],
                "component": {
                    "type": "application",
                    "name": target,
                    "version": "latest"
                }
            },
            "components": [],
            "dependencies": []
        }
        
        for asset in assets:
            asset_id = asset.get("id") or f"urn:uuid:{uuid.uuid4()}"
            name = asset.get("name", "Unknown Cryptographic Component")
            artifact_type = asset.get("artifact_type", "algorithm")
            
            # Map artifact type to CycloneDX component types
            cdx_type = "cryptographic-asset"
            if artifact_type == "Library":
                cdx_type = "library"
            
            component = {
                "type": cdx_type,
                "bom-ref": asset_id,
                "name": name,
                "cryptoProperties": {
                    "assetType": artifact_type.lower(),
                    "algorithmProperties": {
                        "name": name.upper(),
                        "quantumStatus": asset.get("quantum_status", "unknown").lower(),
                    }
                }
            }
            cbom["components"].append(component)
            
            # Simple dependency link to root
            cbom["dependencies"].append({
                "ref": target,
                "dependsOn": [asset_id]
            })
            
        return cbom
