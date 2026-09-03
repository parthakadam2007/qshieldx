import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const maxDuration = 300; // Increased to 1 hour (effectively removing restricted timeouts)
export const dynamic = 'force-dynamic';

function normalizeDomain(input: string): string {
  let value = (input || '').trim().toLowerCase();
  value = value.replace(/^https?:\/\//, '');
  value = value.split('/')[0] || value;
  value = value.split(':')[0] || value;
  if (value.startsWith('www.')) {
    value = value.slice(4);
  }
  return value;
}

function classifyAssetType(hostname: string, ports: number[] = []): string {
  const h = (hostname || "").toLowerCase();
  const hasPort = (p: number) => ports.includes(p);

  if (/(^|\.)api([.-]|$)|graphql|gateway|auth|oauth|sso|rpc/.test(h)) return "API Gateway";
  if (/(^|\.)admin([.-]|$)|panel|portal|cms|dashboard|console/.test(h)) return "Admin Portal";
  if (/(^|\.)db([.-]|$)|mongo|mysql|postgres|redis|cache|sql/.test(h) || hasPort(3306) || hasPort(5432) || hasPort(6379) || hasPort(27017)) return "Database";
  if (/(^|\.)mail([.-]|$)|smtp|imap|pop|mx/.test(h) || hasPort(25) || hasPort(110) || hasPort(143) || hasPort(993) || hasPort(995)) return "Mail Service";
  if (/(^|\.)vpn([.-]|$)|bastion|jump|rdp|ssh|remote/.test(h) || hasPort(22) || hasPort(3389) || hasPort(5900)) return "Remote Access";
  if (/(^|\.)cdn([.-]|$)|static|assets|img|media/.test(h)) return "CDN/Static";
  if (/(^|\.)dev([.-]|$)|staging|stage|test|qa|uat|sandbox/.test(h)) return "Non-Production";
  if (/(^|\.)www([.-]|$)|web|site|frontend|client/.test(h) || hasPort(80) || hasPort(443) || hasPort(8080) || hasPort(8443)) return "Web Server";
  if (/mobile|android|ios|app/.test(h)) return "Application Service";

  return "Server";
}

const COMMON_PORTS: Record<number, string> = {
  21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS", 80: "HTTP", 110: "POP3",
  111: "RPCBind", 135: "MSRPC", 139: "NetBIOS", 143: "IMAP", 443: "HTTPS", 445: "Microsoft-DS",
  993: "IMAPS", 995: "POP3S", 1723: "PPTP", 3306: "MySQL", 3389: "RDP", 5432: "PostgreSQL",
  5900: "VNC", 6379: "Redis", 8000: "HTTP-Alt", 8080: "HTTP-Proxy", 8443: "HTTPS-Alt",
  9000: "Portainer", 27017: "MongoDB"
};

async function resolveIP(domain: string): Promise<string> {
  try {
    const res = await fetch(`http://localhost:8000/api/get_ip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: domain })
    });
    if (!res.ok) return "Pending...";
    const data = await res.json();
    return data.ip || "Pending...";
  } catch (err) {
    return "Pending...";
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userProfile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (userProfile?.role === "customer") {
      return NextResponse.json({ error: "Insufficient permissions. Customers cannot initiate scans." }, { status: 403 });
    }

    const payload = await request.json();
    const targetId = payload.targetId;
    const scanMode = payload.mode || "fast";

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    // Fetch the target to get the domain
    const { data: targetDoc, error: targetError } = await supabase
      .from('scan_jobs')
      .select('*')
      .eq('id', targetId)
      .single();

    if (targetError || !targetDoc) {
      return NextResponse.json({ error: "Target not found" }, { status: 404 });
    }

    const rawTargetDomain = targetDoc.target_domain || targetDoc.primary_domain || targetDoc.name || "example.com";
    const targetDomain = normalizeDomain(String(rawTargetDomain));

    // Update target status to 'Scanning'
    await supabase.from('scan_jobs').update({ status: 'Scanning' }).eq('id', targetId);

    console.log(`>>> PROXYING AGENT SCAN [Mode: ${scanMode.toUpperCase()}] FOR DOMAIN: [${targetDomain}] (TargetID: ${targetId})`);

    const agentResponse = await fetch("http://127.0.0.1:8000/api/scan_domain_pipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: targetDomain, mode: scanMode })
    });

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      throw new Error(`Agent backend responded with status: ${agentResponse.status}: ${errorText}`);
    }

    const parsedData = await agentResponse.json();

    console.log("--- AGENT PIPELINE RESPONSE RECEIVED ---");

    // Clean up old records for this target
    console.log(`>>> Cleaning up old records for TargetID: [${targetId}]`);
    await supabase.from('assets').delete().eq('scan_job_id', targetId);

    let insertedAssets = 0;
    let insertedPorts = 0;
    let insertedServices = 0;
    let topologyUpdated = false;

    // 1. Process Assets
    if (parsedData?.assets && Array.isArray(parsedData.assets)) {
      const assetsToInsert = await Promise.all(
        parsedData.assets.map(async (a: any) => {
          const ip = await resolveIP(a.subdomain);
          const ports = Array.isArray(a.ports) ? a.ports.filter((p: unknown) => typeof p === "number") : [];

          return {
            scan_job_id: targetId,
            asset_type: 'subdomain',
            asset_value: a.subdomain || "Unknown Asset",
            metadata: {
              ip,
              type: classifyAssetType(a.subdomain || "", ports),
              ports
            }
          };
        })
      );

      if (assetsToInsert.length > 0) {
        await supabase.from('assets').insert(assetsToInsert);
        insertedAssets = assetsToInsert.length;
      }

      // Grouping logic for Ports and Services to insert as special assets
      const portGroups: Record<number, any> = {};
      const serviceGroups: Record<string, any> = {};

      parsedData.assets.forEach((a: any) => {
        if (a.ports && Array.isArray(a.ports)) {
          a.ports.forEach((portNumber: number) => {
            const serviceName = COMMON_PORTS[portNumber] || "Unknown Service";

            if (!portGroups[portNumber]) {
              portGroups[portNumber] = {
                scan_job_id: targetId,
                asset_type: 'port',
                asset_value: `${portNumber}`,
                metadata: {
                  protocol: "TCP",
                  service: serviceName,
                  description: `${serviceName} protocol on port ${portNumber}`,
                  state: "open",
                  assets: []
                }
              };
            }
            portGroups[portNumber].metadata.assets.push({
              id: a.subdomain,
              name: a.subdomain,
              ip: a.ip || "Pending...",
            });

            if (!serviceGroups[serviceName]) {
              serviceGroups[serviceName] = {
                scan_job_id: targetId,
                asset_type: 'service',
                asset_value: serviceName,
                metadata: {
                  port: portNumber,
                  protocol: "TCP",
                  version: "Detected",
                  riskScore: portNumber === 80 ? 85 : 20,
                  assets: []
                }
              };
            }
            serviceGroups[serviceName].metadata.assets.push({
              id: a.subdomain,
              name: a.subdomain,
              ip: a.ip || "Pending...",
            });
          });
        }
      });

      const finalPorts = Object.values(portGroups);
      const finalServices = Object.values(serviceGroups);

      if (finalPorts.length > 0) {
        await supabase.from('assets').insert(finalPorts);
        insertedPorts = finalPorts.length;
      }

      if (finalServices.length > 0) {
        await supabase.from('assets').insert(finalServices);
        insertedServices = finalServices.length;
      }
    }

    if (parsedData?.topology) {
      await supabase.from('attack_graph').delete().eq('scan_job_id', targetId);
      await supabase.from('attack_graph').insert({
        scan_job_id: targetId,
        graph_data: parsedData.topology
      });
      topologyUpdated = true;
    }

    await supabase.from('scan_jobs').update({
      status: 'Idle',
      metadata: {
        ...(targetDoc.metadata || {}),
        domainsCount: insertedAssets,
        assetsDiscovered: insertedAssets
      }
    }).eq('id', targetId);

    return NextResponse.json(
      {
        success: true,
        message: `Pipeline scan complete: ${insertedAssets} assets, ${insertedPorts} ports discovered.`,
        stats: { assets: insertedAssets, ports: insertedPorts, services: insertedServices, topologyUpdated },
        agentOutput: parsedData
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Agent pipeline execution failed:", error);

    try {
      const payload = await request.clone().json();
      if (payload.targetId) {
        const supabase = await createClient();
        await supabase.from('scan_jobs').update({ status: 'Idle' }).eq('id', payload.targetId);
      }
    } catch (e) {
      console.error("Could not reset target status in catch block", e);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: error.name === 'AbortError' ? 'Scan timed out' : 'Failed to process pipeline scan',
        detail: errorMessage
      },
      { status: 500 }
    );
  }
}
