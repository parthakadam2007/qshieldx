import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, targetId, context } = await request.json();

    const SYSTEM_PROMPT = `You are a Senior Security Analyst and Reconnaissance Specialist for the Qshield Dashboard. 
Your goal is to analyze the attack surface of the target organization based on live discovery data.

CURRENT TARGET: ${context?.target?.name} (${context?.target?.domain})

INVENTORY SUMMARY:
- Assets: ${context?.assets?.length || 0} discovered subdomains/hosts.
- Ports: ${context?.ports?.length || 0} open ports detected.
- Services: ${context?.services?.length || 0} unique services identified.

DATA CONTEXT:
${JSON.stringify(context, null, 2)}

INSTRUCTIONS:
1. Provide concise, technical, and actionable intelligence.
2. If the user asks about vulnerabilities, cross-reference the open ports and service versions.
3. Highlight high-risk exposures (e.g., exposed databases, RDP on port 3389, outdated SSH/Web servers).
4. If no data is available for a query, suggest the user "Launch Recon" to gather live telemetry.
5. Be professional and prioritize security findings over general conversation.`;

    console.log(`>>> ENGAGING AI ANALYST FOR TARGET: [${targetId}]`);

    // Proxy to your backend's intelligence analysis endpoint
    const agentResponse = await fetch("http://127.0.0.1:8000/api/ollama/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        system_prompt: SYSTEM_PROMPT,
        target_id: targetId,
        context: context
      })
    });

    if (!agentResponse.ok) {
      throw new Error(`Agent backend responded with status: ${agentResponse.status}`);
    }

    const data = await agentResponse.json();

    // Return the AI's response to the frontend
    return NextResponse.json({
      response: data.response || data.text || "I've analyzed the current discovery data, but couldn't formulate a specific response."
    });

  } catch (error: any) {
    console.error("Agent chat execution failed:", error);
    return NextResponse.json(
      { error: "Failed to process intelligence query" },
      { status: 500 }
    );
  }
}
