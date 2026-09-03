import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        // const session = await auth();

        // if (!session || !session.user) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        // ✅ Use query params instead of body
        const { searchParams } = new URL(request.url);
        let domain = searchParams.get("domain");

        if (!domain) {
            return NextResponse.json({ error: "Domain is required" }, { status: 400 });
        }

        // ✅ Normalize input (remove protocol, path, etc.)
        domain = domain
            .replace(/^https?:\/\//, "")
            .split("/")[0]
            .trim();

        // ✅ Timeout controller
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const agentResponse = await fetch("http://localhost:8000/api/get_ip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ host: domain }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!agentResponse.ok) {
            const errorText = await agentResponse.text();
            console.error(`Backend Error: ${errorText}`);
            return NextResponse.json(
                { error: "Backend failed", detail: errorText },
                { status: agentResponse.status }
            );
        }

        const data = await agentResponse.json();

        return NextResponse.json({
            domain,
            ip: data.ip
        });

    } catch (error: any) {
        if (error.name === "AbortError") {
            return NextResponse.json(
                { error: "Request timed out" },
                { status: 504 }
            );
        }

        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to execute on backend" },
            { status: 500 }
        );
    }
}