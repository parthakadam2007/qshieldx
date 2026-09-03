import os
import shutil
import shlex
import tempfile
import subprocess
import re
from typing import Dict, Any, Optional

class DiscoveryService:
    @staticmethod
    def run_recon_pipeline(domain: str, mode: str) -> Dict[str, Any]:
        """
        Executes the basic discovery recon pipeline to find subdomains and ports.
        """
        def resolve_tool(tool_name: str) -> str:
            found = shutil.which(tool_name)
            if found:
                return found
            go_bin = os.path.join(os.path.expanduser("~"), "go", "bin")
            candidates = [
                os.path.join(go_bin, tool_name),
                os.path.join(go_bin, f"{tool_name}.exe"),
            ]
            for candidate in candidates:
                if os.path.exists(candidate):
                    return candidate
            return tool_name

        # Fallback simplistic approach if bash is not available or to keep it lightweight.
        discovered = set()
        
        try:
            sf = subprocess.run(
                [resolve_tool("subfinder"), "-d", domain, "-silent"],
                capture_output=True,
                text=True,
                timeout=120
            )
            if sf.returncode == 0 and sf.stdout:
                for line in sf.stdout.splitlines():
                    item = line.strip().lower()
                    if item and domain in item:
                        discovered.add(item)
        except Exception as e:
            print(f"[!] subfinder failed: {e}")
            
        subdomains = sorted(discovered)
        if not subdomains:
            subdomains = [domain]

        ports_dict = {}
        for host in subdomains:
            try:
                nm = subprocess.run(
                    ["nmap", "-Pn", "--top-ports", "10", host],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                if nm.returncode == 0 and nm.stdout:
                    for ln in nm.stdout.splitlines():
                        row = ln.strip().lower()
                        if "/tcp" in row and " open " in row:
                            try:
                                port_num = int(row.split("/tcp", 1)[0].strip())
                            except ValueError:
                                continue
                            if host not in ports_dict:
                                ports_dict[host] = []
                            if port_num not in ports_dict[host]:
                                ports_dict[host].append(port_num)
            except Exception as e:
                print(f"[!] nmap fallback failed for {host}: {e}")

        assets = []
        for subdomain in subdomains:
            asset = {
                "subdomain": subdomain,
                "ports": ports_dict.get(subdomain, [])
            }
            assets.append(asset)
            
        return {
            "domain": domain,
            "mode": mode,
            "assets": assets,
            "total_subdomains": len(subdomains),
            "total_assets": len(assets)
        }
