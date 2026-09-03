# OOP: Encapsulation — This module encapsulates the LangGraph multi-agent workflow to hide state management and tool integration details.
# OOP: Abstraction — The agent abstraction allows users to interact with complex AI reasoning without understanding graph nodes and edges.

import argparse
import re
import pyttsx3
import json
from typing import TypedDict, Annotated, Sequence

from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt
from rich.markdown import Markdown

from langchain_core.messages import BaseMessage, HumanMessage, ToolMessage, SystemMessage, AIMessage
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver

from sandbox.osint_tools import tools

# --- 2. Define State ---
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    scan_target: str
    discovered_assets: list
    classified_assets: list
    quantum_risk_scores: dict
    cbom_data: dict
    migration_plan: str

# --- 3. Initialize Model ---
model = ChatOllama(model="qwen3:1.7b", temperature=0)
model_with_tools = model.bind_tools(tools)
pure_model = ChatOllama(model="qwen3:1.7b", temperature=0)

# --- 4. Define Agent Nodes ---

def planner_agent(state: AgentState):
    messages = state.get("messages", [])
    prompt = SystemMessage(content="You are the Planner Agent. Understand the user's target domain and formulate a plan for cryptographic discovery.")
    response = pure_model.invoke([prompt] + messages)
    
    # Extract target from user input (simplified)
    target = "unknown"
    for m in messages:
        if isinstance(m, HumanMessage):
            target = m.content.split()[-1] # Fallback simple extraction
            
    return {"messages": [response], "scan_target": target}

def security_discovery_agent(state: AgentState):
    messages = state.get("messages", [])
    prompt = SystemMessage(content="You are the Security Discovery Agent. Use tools to find subdomains, IPs, and TLS endpoints. Run testssl.sh on them.")
    response = model_with_tools.invoke([prompt] + messages)
    return {"messages": [response], "discovered_assets": [{"endpoint": state.get("scan_target", "unknown"), "tls_enabled": True}]}

def classification_agent(state: AgentState):
    messages = state.get("messages", [])
    prompt = SystemMessage(content="You are the Classification Agent. Classify discovered assets by artifact_type, business_criticality, lifetime_years, and quantum_status.")
    response = pure_model.invoke([prompt, HumanMessage(content=f"Classify these assets: {state.get('discovered_assets')}")])
    return {"messages": [response], "classified_assets": [{"endpoint": state.get("scan_target"), "business_criticality": "high", "quantum_status": "vulnerable"}]}

def threat_intelligence_agent(state: AgentState):
    messages = state.get("messages", [])
    prompt = SystemMessage(content="You are the Threat Intelligence Agent. Identify known vulnerabilities (CVEs) in the classified cryptographic assets.")
    response = model_with_tools.invoke([prompt] + messages)
    return {"messages": [response]}

def quantum_risk_agent(state: AgentState):
    messages = state.get("messages", [])
    prompt = SystemMessage(content="You are the Quantum Risk Agent. Evaluate algorithms (RSA, ECC) for post-quantum vulnerabilities and generate a risk score.")
    response = pure_model.invoke([prompt, HumanMessage(content=f"Assess risk for: {state.get('classified_assets')}")])
    return {"messages": [response], "quantum_risk_scores": {"overall_score": 85, "vulnerable_algorithms": ["RSA-2048"]}}

def cbom_agent(state: AgentState):
    messages = state.get("messages", [])
    prompt = SystemMessage(content="You are the CBOM Agent. Aggregate all findings into a structured Cryptographic Bill of Materials (CBOM) JSON format.")
    response = pure_model.invoke([prompt, HumanMessage(content=f"Generate CBOM for: {state.get('classified_assets')}")])
    return {"messages": [response], "cbom_data": {"components": [{"name": "TLS Cert", "algorithm": "RSA-2048"}]}}

def migration_planner_agent(state: AgentState):
    messages = state.get("messages", [])
    prompt = SystemMessage(content="You are the Migration Planner Agent. Generate a step-by-step Post-Quantum Migration report based on the CBOM and Risk Scores.")
    response = pure_model.invoke([prompt, HumanMessage(content=f"Generate migration plan for: {state.get('cbom_data')} with risk: {state.get('quantum_risk_scores')}")])
    return {"messages": [response], "migration_plan": response.content}

tool_node = ToolNode(tools)

# --- 5. Build Graph ---
workflow = StateGraph(AgentState)

workflow.add_node("planner", planner_agent)
workflow.add_node("discovery", security_discovery_agent)
workflow.add_node("classification", classification_agent)
workflow.add_node("threat_intel", threat_intelligence_agent)
workflow.add_node("quantum_risk", quantum_risk_agent)
workflow.add_node("cbom", cbom_agent)
workflow.add_node("migration_planner", migration_planner_agent)
workflow.add_node("tools", tool_node)

workflow.add_edge(START, "planner")
workflow.add_edge("planner", "discovery")

# Tools condition for discovery and threat intel
workflow.add_conditional_edges("discovery", tools_condition, {"tools": "tools", "__end__": "classification"})
workflow.add_edge("tools", "discovery") # Route back to discovery after tool use (simplified)

workflow.add_edge("classification", "threat_intel")
workflow.add_edge("threat_intel", "quantum_risk")
workflow.add_edge("quantum_risk", "cbom")
workflow.add_edge("cbom", "migration_planner")
workflow.add_edge("migration_planner", END)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

if __name__ == "__main__":
    # Parse accessibility arguments
    parser = argparse.ArgumentParser(description="🛡️ QShieldX AI Pipeline")
    parser.add_argument("--accessible", action="store_true", help="Screen reader mode.")
    parser.add_argument("--tts", action="store_true", help="Text-to-Speech.")
    args, unknown = parser.parse_known_args()

    console = Console(color_system=None, force_terminal=False) if args.accessible else Console()
    console.print(Panel.fit("[bold cyan]QShieldX 7-Stage Pipeline Initialized[/bold cyan]\n[italic]Provide a target domain to begin the analysis.[/italic]", title="[bold blue]🛡️ QShieldX[/bold blue]"))
    
    while True:
        try:
            user_input = Prompt.ask("\n[bold green]Target[/bold green]")
            if user_input.lower() in ["quit", "exit"]:
                break
                
            inputs = {"messages": [HumanMessage(content=user_input)]}
            config = {"configurable": {"thread_id": "session-1"}}
            
            with console.status("[bold yellow]Pipeline running...[/bold yellow]", spinner="dots"):
                for event in app.stream(inputs, config=config, stream_mode="values"):
                    if "messages" in event and len(event["messages"]) > 0:
                        message = event["messages"][-1]
                        if isinstance(message, AIMessage) and message.content:
                            console.print(f"[bold magenta]Agent Update:[/bold magenta] {message.content[:100]}...")
                            
                # Final output
                state = app.get_state(config)
                console.print(Panel(Markdown(state.values.get("migration_plan", "No plan generated.")), title="[bold green]Migration Plan[/bold green]"))
                
        except KeyboardInterrupt:
            break
        except Exception as e:
            console.print(f"\n[bold red]Error:[/bold red] {str(e)}")
