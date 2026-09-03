import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get("assetId");

    if (!assetId) {
      return NextResponse.json({ error: "assetId is required" }, { status: 400 });
    }

    const { data: record, error } = await supabase
      .from("ssl_scans")
      .select("ssl_data, scanned_at")
      .eq("asset_id", assetId)
      .single();

    if (error || !record) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: record.ssl_data, scannedAt: record.scanned_at });
  } catch (error: any) {
    console.error("SSL fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch SSL data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain, assetId } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    console.log(`>>> PROXYING TESTSSL SCAN FOR: [${domain}]`);

    const agentResponse = await fetch("http://localhost:8000/api/testssl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: domain, port: 443 })
    });

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error(`Backend Error: ${errorText}`);
      throw new Error(`Agent backend responded with status: ${agentResponse.status}`);
    }

    const data = await agentResponse.json();

    if (assetId) {
      try {
        await supabase
          .from("ssl_scans")
          .upsert({
            asset_id: assetId,
            domain,
            ssl_data: data,
            scanned_at: new Date().toISOString()
          });
        console.log(`>>> SSL scan saved for assetId: ${assetId}`);
      } catch (dbErr) {
        console.error("Failed to save SSL data to DB:", dbErr);
      }
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("SSL Scan proxy error:", error);
    return NextResponse.json(
      { error: "Failed to execute SSL scan on backend" },
      { status: 500 }
    );
  }
}
