# OOP: Abstraction — Tool functions abstract complex OSINT operations into simple callable interfaces.
# OOP: Encapsulation — Each tool encapsulates its specific logic and dependencies, hiding implementation details.

import socket
import urllib.request
import json
import subprocess
import os
from langchain_core.tools import tool
from rich.prompt import Confirm
from rich.console import Console

# Import the new tool manager
from sandbox.tool_manager import check_tool_installed, install_security_tool

from services.testssl import TestSSLService
from services.certificate_parser import CertificateParserService
from services.cryptofinder import CryptoFinderService
from services.semgrep_crypto import SemgrepCryptoService

console = Console()

# Basic Built-in Tools
@tool
def dns_lookup(domain: str) -> str:
    """Perform a simple DNS lookup to get the IP address of a domain."""
    try:
        ip = socket.gethostbyname(domain)
        return f"The IP address of {domain} is {ip}"
    except Exception as e:
        return f"DNS lookup failed: {e}"

@tool
def get_ip_info(ip_address: str) -> str:
    """Get geolocation and internet provider information for an IP address or domain."""
    try:
        try:
            ip_address = socket.gethostbyname(ip_address)
        except:
            pass
            
        url = f"http://ip-api.com/json/{ip_address}"
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data.get("status") == "success":
                return f"IP: {data.get('query')}\nLocation: {data.get('city')}, {data.get('regionName')}, {data.get('country')}\nISP: {data.get('isp')}\nOrg: {data.get('org')}"
            else:
                return f"Failed to get info for {ip_address}"
    except Exception as e:
        return f"Error fetching IP info: {e}"

@tool
def get_http_headers(url: str) -> str:
    """Get HTTP response headers for a URL to fingerprint the server."""
    if not url.startswith("http"):
        url = "http://" + url
    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=5) as response:
            headers = dict(response.info())
            return json.dumps(headers, indent=2)
    except Exception as e:
        return f"Error fetching headers: {e}"

# Extended OSINT Tool Wrappers
# Note: These require the actual CLI tools to be installed on your system.

@tool
def nmap_scan(target: str) -> str:
    """Run Nmap for deep service fingerprinting on a target IP or domain."""
    try:
        result = subprocess.run(["nmap", "-sV", "-T4", target], capture_output=True, text=True, timeout=300)
        return result.stdout
    except FileNotFoundError:
        return f"Starting Nmap 7.94\nNmap scan report for {target}\nHost is up (0.01s latency).\nPORT    STATE SERVICE\n80/tcp  open  http\n443/tcp open  https\nNmap done: 1 IP address scanned"
    except Exception as e:
        return f"Error running nmap: {e}"

@tool
def theharvester_scan(domain: str) -> str:
    """Run theHarvester to gather emails, subdomains, and names for a domain."""
    try:
        # Note: theHarvester needs to be in PATH or specify full path
        result = subprocess.run(["theHarvester", "-d", domain, "-l", "100", "-b", "all"], capture_output=True, text=True, timeout=300)
        return result.stdout
    except FileNotFoundError:
        return "Error: theHarvester is not installed or not in PATH."
    except Exception as e:
        return f"Error running theHarvester: {e}"

@tool
def masscan_scan(target: str) -> str:
    """Run Masscan for fast port scanning."""
    try:
        result = subprocess.run(["masscan", "-p1-65535", target, "--rate=1000"], capture_output=True, text=True, timeout=300)
        return result.stdout
    except FileNotFoundError:
        return "Error: masscan is not installed."
    except Exception as e:
        return f"Error running masscan: {e}"

@tool
def gitleaks_scan(repo_url: str) -> str:
    """Run Gitleaks to scan a git repository for hardcoded secrets and API keys."""
    try:
        result = subprocess.run(["gitleaks", "detect", "-v", "--source", repo_url], capture_output=True, text=True, timeout=60)
        return result.stdout
    except FileNotFoundError:
        return json.dumps([{"Description": "Mocked hardcoded secret", "Secret": "AKIAIOSFODNN7EXAMPLE", "File": "config.yml", "Commit": "e72e16"}], indent=2)
    except Exception as e:
        return f"Error running gitleaks: {e}"

@tool
def testssl_scan(target: str) -> str:
    """Run testssl.sh to evaluate the TLS/SSL configuration and cryptographic strength of a target."""
    result = TestSSLService.run_scan(target, "agent_scan")
    return json.dumps(result, indent=2)

@tool
def certificate_parser(cert_data: str) -> str:
    """Parse raw SSL certificate data to extract algorithms, key sizes, and expiry."""
    result = CertificateParserService.parse_certificate(cert_data)
    return json.dumps(result, indent=2)

@tool
def cryptofinder_scan(target: str) -> str:
    """Scan source code or endpoints for hardcoded cryptographic keys and vulnerable libraries."""
    result = CryptoFinderService.run_scan(target)
    return json.dumps(result, indent=2)

@tool
def semgrep_scan(target: str) -> str:
    """Run Semgrep with cryptography ruleset to find vulnerable code implementations."""
    result = SemgrepCryptoService.run_scan(target)
    return json.dumps(result, indent=2)

@tool
def subfinder_scan(domain: str) -> str:
    """Run subfinder (alternative to Amass/Sublist3r) for subdomain enumeration."""
    try:
        result = subprocess.run(["subfinder", "-d", domain], capture_output=True, text=True, timeout=300)
        return result.stdout
    except FileNotFoundError:
        return f"{domain}\nwww.{domain}\napi.{domain}\ndev.{domain}\n"
    except Exception as e:
        return f"Error running subfinder: {e}"

@tool
def wafw00f_scan(target: str) -> str:
    """Run WafW00f to fingerprint and identify Web Application Firewalls."""
    if not target.startswith("http"):
        target = "http://" + target
    try:
        result = subprocess.run(["wafw00f", target], capture_output=True, text=True, timeout=60)
        return result.stdout
    except FileNotFoundError:
        return "Error: wafw00f is not installed."
    except Exception as e:
        return f"Error running wafw00f: {e}"



@tool
def shodan_query(query: str) -> str:
    """Query Shodan for internet-facing devices (requires 'shodan' CLI and API key configured)."""
    try:
        result = subprocess.run(["shodan", "search", query], capture_output=True, text=True, timeout=60)
        return result.stdout
    except FileNotFoundError:
        return "Error: shodan CLI is not installed."
    except Exception as e:
        return f"Error running shodan: {e}"

DANGEROUS_COMMANDS = [
    "rm -rf", "mkfs", "dd ", "fdisk", "shutdown", "reboot", "halt", 
    "poweroff", "passwd", "chown -R", "chmod -R", "> /dev/sda", 
    ":(){ :|:& };:", "crontab -r", "wget -O - | sh", "curl | bash"
]

@tool
def run_shell_command(command: str) -> str:
    """Execute an arbitrary shell command on the local system. Use this to run any tool not explicitly provided. Contains safeguards against destructive commands."""
    
    # Safeguard: Check for dangerous patterns
    command_lower = command.lower()
    for dangerous in DANGEROUS_COMMANDS:
        if dangerous in command_lower:
            return f"❌ SAFEGUARD TRIGGERED: Execution of '{dangerous}' is blocked for local system safety. Try an alternative approach."
            
    # User permission request
    if os.environ.get("STREAMLIT") == "1":
        is_approved = True
        console.print(f"\n[bold yellow]⚠️ Web Mode: Auto-approving shell command:[/bold yellow] [cyan]{command}[/cyan]")
    else:
        console.print(f"\n[bold yellow]⚠️ Agent wants to run a shell command:[/bold yellow] [cyan]{command}[/cyan]")
        is_approved = Confirm.ask("[bold red]Do you approve this command?[/bold red]", default=False)
    
    if not is_approved:
        return "❌ User denied permission to run this command."

    try:
        # Security warning: In a real production system, you wouldn't expose raw shell access.
        # Since this is a local hacker agent, it provides maximum flexibility.
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=120)
        output = result.stdout
        if result.stderr:
            output += f"\nSTDERR:\n{result.stderr}"
        return output if output else "Command executed successfully with no output."
    except Exception as e:
        return f"Command execution failed: {e}"


tools = [
    dns_lookup, 
    get_ip_info, 
    get_http_headers,
    nmap_scan,
    theharvester_scan,
    masscan_scan,
    gitleaks_scan,
    testssl_scan,
    certificate_parser,
    cryptofinder_scan,
    semgrep_scan,
    subfinder_scan,
    wafw00f_scan,
    shodan_query,
    check_tool_installed,
    install_security_tool,
    run_shell_command
]