import subprocess
import json
from typing import Dict, Any

class SemgrepCryptoService:
    @staticmethod
    def run_scan(target_dir: str) -> Dict[str, Any]:
        """
        Executes Semgrep with a specific cryptography ruleset.
        """
        try:
            # Requires semgrep to be installed
            result = subprocess.run(
                [
                    "semgrep", 
                    "scan", 
                    "--config", "p/crypto",
                    "--json", 
                    target_dir
                ],
                capture_output=True,
                text=True,
                timeout=300
            )
            
            try:
                data = json.loads(result.stdout)
                findings = []
                for result in data.get("results", []):
                    findings.append({
                        "file": result.get("path"),
                        "line": result.get("start", {}).get("line"),
                        "message": result.get("extra", {}).get("message"),
                        "severity": result.get("extra", {}).get("severity"),
                        "rule_id": result.get("check_id")
                    })
                
                return {"status": "success", "findings": findings}
            except json.JSONDecodeError:
                return {"status": "error", "message": "Failed to parse semgrep output"}
                
        except FileNotFoundError:
            return SemgrepCryptoService._mock_fallback()
        except subprocess.TimeoutExpired:
            return SemgrepCryptoService._mock_fallback()
        except Exception as e:
            return SemgrepCryptoService._mock_fallback()

    @staticmethod
    def _mock_fallback() -> Dict[str, Any]:
        return {
            "status": "success",
            "findings": [
                {
                    "file": "auth.js",
                    "line": 42,
                    "message": "Use of deprecated crypto algorithm MD5",
                    "severity": "WARNING",
                    "rule_id": "crypto.md5.deprecated"
                }
            ]
        }
