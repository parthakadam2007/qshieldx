# OOP: Encapsulation — This module encapsulates tool installation and checking logic to hide platform-specific details.
# OOP: Abstraction — Functions abstract complex installation processes into simple interfaces.

import subprocess
import shutil
import platform
import os
from langchain_core.tools import tool
from rich.console import Console
from rich.prompt import Confirm

console = Console()

# Mapping of tools to their installation commands based on OS
INSTALL_COMMANDS = {
    "macos": {
        "nmap": "brew install nmap",
        "masscan": "brew install masscan",
        "nuclei": "brew install nuclei",
        "subfinder": "brew install subfinder",
        "wafw00f": "brew install wafw00f",
        "feroxbuster": "brew install feroxbuster",
        "shodan": "pipx install shodan || pip install shodan",
        "theharvester": "brew install theharvester",
        "gitleaks": "brew install gitleaks",
        "amass": "brew install amass"
    },
    "linux": {
        "nmap": "sudo apt-get install -y nmap",
        "masscan": "sudo apt-get install -y masscan",
        "nuclei": "go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest",
        "subfinder": "go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest",
        "wafw00f": "sudo apt-get install -y wafw00f",
        "feroxbuster": "curl -sL https://raw.githubusercontent.com/epi052/feroxbuster/main/install-nix.sh | bash",
        "shodan": "pipx install shodan || pip install shodan",
        "theharvester": "sudo apt-get install -y theharvester",
        "gitleaks": "wget https://github.com/gitleaks/gitleaks/releases/download/v8.18.2/gitleaks_8.18.2_linux_x64.tar.gz && tar -xzf gitleaks_8.18.2_linux_x64.tar.gz && sudo mv gitleaks /usr/local/bin/",
        "amass": "go install -v github.com/owasp-amass/amass/v4/...@master"
    }
}

@tool
def check_tool_installed(tool_name: str) -> str:
    """Check if a specific security tool is installed and available in the system PATH."""
    if shutil.which(tool_name):
        return f"✅ Tool '{tool_name}' is installed and available."
    return f"❌ Tool '{tool_name}' is NOT installed and needs to be installed before use."

@tool
def install_security_tool(tool_name: str) -> str:
    """Attempt to install a missing security tool (e.g., nmap, nuclei, subfinder). Always asks the user for permission first."""
    tool_name = tool_name.lower().strip()
    
    if shutil.which(tool_name):
        return f"Tool '{tool_name}' is already installed."

    os_type = "macos" if platform.system().lower() == "darwin" else "linux"
    cmds = INSTALL_COMMANDS.get(os_type, {})
    
    cmd = cmds.get(tool_name)
    if not cmd:
        return f"❌ I don't have an automated installation script for '{tool_name}' on {os_type}. Try using run_shell_command to install it manually."

    # Interactively ask the user for permission to install
    if os.environ.get("STREAMLIT") == "1":
        is_approved = True
        console.print(f"\n[bold yellow]📦 Web Mode: Auto-approving installation:[/bold yellow] [cyan]{tool_name}[/cyan]")
    else:    
        console.print(f"\n[bold yellow]📦 Agent wants to install a missing tool:[/bold yellow] [cyan]{tool_name}[/cyan]")
        console.print(f"[dim]Proposed installation command: {cmd}[/dim]")
        is_approved = Confirm.ask(f"[bold red]Do you approve the installation of {tool_name}?[/bold red]", default=False)

    if not is_approved:
        return f"❌ User denied permission to install {tool_name}."

    console.print(f"[bold blue]Executing installation for {tool_name}... this may take a moment.[/bold blue]")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            return f"✅ '{tool_name}' installed successfully.\nInstallation Output:\n{result.stdout}"
        else:
            return f"❌ Failed to install '{tool_name}'.\nError Output:\n{result.stderr}\n\nYou may need to install it manually."
    except Exception as e:
        return f"❌ Exception occurred during installation of '{tool_name}': {e}"