# OOP: Encapsulation — This module encapsulates the Streamlit UI to hide web interface details from the core agent logic.
# OOP: Composition — Composes the LangGraph agent with UI components to create a complete web application.

import os
# Must set before importing app bounds
os.environ["STREAMLIT"] = "1"

import streamlit as st
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from app import app as langgraph_agent
from sandbox.osint_tools import tools

st.set_page_config(page_title="CyberSec Hacker Agent", page_icon="💀", layout="wide")

st.title("💀 CyberSec OSINT Hacker Agent")
st.markdown("An autonomous AI agent with access to dozens of security tools.")

with st.sidebar:
    st.header("🧰 Available Tools")
    for t in tools:
        st.write(f"- `{t.name}`: {t.description.split('.')[0]}")
    
    st.markdown("---")
    st.warning("⚠️ **Web Mode Enabled**: CLI Prompts for shell execution and tool installations are auto-approved to prevent the server from hanging.")

# Initialize chat history and LangGraph config
if "messages" not in st.session_state:
    st.session_state.messages = []

config = {"configurable": {"thread_id": "streamlit-web-session"}}

# Display chat messages from history
for msg in st.session_state.messages:
    if isinstance(msg, HumanMessage):
        with st.chat_message("user", avatar="👤"):
            st.markdown(msg.content)
    elif isinstance(msg, AIMessage):
        with st.chat_message("assistant", avatar="🤖"):
            st.markdown(msg.content)

# Accept user input
if prompt := st.chat_input("Enter a domain, IP, or security command..."):
    # Display user message
    with st.chat_message("user", avatar="👤"):
        st.markdown(prompt)
    
    # Track the new human message into State
    st.session_state.messages.append(HumanMessage(content=prompt))
    
    # Process through the LangGraph model
    with st.chat_message("assistant", avatar="🤖"):
        # We use st.status to hold the "Thinking" state and expand tool calls
        status = st.status("Agent is analyzing the target and drafting tools...", expanded=True)
        
        final_answer = ""
        inputs = {"messages": [HumanMessage(content=prompt)]}
        
        for chunk in langgraph_agent.stream(inputs, config=config, stream_mode="values"):
            message = chunk["messages"][-1]
            
            # Skip echoing the user's prompt
            if isinstance(message, HumanMessage):
                continue
                
            # If the model emits a tool call
            if hasattr(message, "tool_calls") and message.tool_calls:
                for t in message.tool_calls:
                    status.write(f"🔧 **Tool execution:** `{t['name']}`")
                    with status.expander(f"Parameters for {t['name']}"):
                        st.json(t['args'])
                        
            # If the model has completed the step and offers text
            elif hasattr(message, "content") and message.content:
                final_answer = message.content
        
        status.update(label="Analysis Complete", state="complete", expanded=False)
        
        # Display the final AI response
        st.markdown(final_answer)
        st.session_state.messages.append(AIMessage(content=final_answer))