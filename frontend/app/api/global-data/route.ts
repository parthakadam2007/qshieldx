import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const targetId = searchParams.get('targetId');
    const skip = (page - 1) * limit;

    const supabase = await createClient();

    // Since our database schema has changed, we simplify the response to use what's available
    // or map it from the new schema (scan_jobs, assets, findings, attack_graph)
    if (type && ['assets', 'ports', 'services'].includes(type)) {
      // For now, map everything to assets if it's assets, ports, or services.
      // A more robust implementation would differentiate asset_type in Supabase.
      let query = supabase.from('assets').select('*', { count: 'exact' });
      
      if (targetId && targetId !== 'all') {
        query = query.eq('scan_job_id', targetId);
      }
      
      if (type === 'ports') {
        query = query.eq('asset_type', 'port');
      } else if (type === 'services') {
        query = query.eq('asset_type', 'service');
      } else {
        query = query.in('asset_type', ['domain', 'subdomain', 'ip']);
      }

      const { data: items, count: total, error } = await query
        .range(skip, skip + limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({
        data: items || [],
        total: total || 0,
        page,
        limit,
        totalPages: Math.ceil((total || 0) / limit)
      });
    }

    // Default: Fetch everything (summary view)
    let scanJobsQuery = supabase.from('scan_jobs').select('*');
    let assetsQuery = supabase.from('assets').select('*');
    let findingsQuery = supabase.from('findings').select('*');
    let topologyQuery = supabase.from('attack_graph').select('*').limit(10);

    if (targetId && targetId !== 'all') {
      scanJobsQuery = scanJobsQuery.eq('id', targetId);
      assetsQuery = assetsQuery.eq('scan_job_id', targetId);
      findingsQuery = findingsQuery.eq('scan_job_id', targetId);
      topologyQuery = topologyQuery.eq('scan_job_id', targetId);
    }

    const [
      { data: targets },
      { data: assets },
      { data: findings },
      { data: topology }
    ] = await Promise.all([
      scanJobsQuery,
      assetsQuery,
      findingsQuery,
      topologyQuery
    ]);

    // Split assets into what the UI expects
    const actualAssets = (assets || []).filter(a => ['domain', 'subdomain', 'ip'].includes(a.asset_type));
    const ports = (assets || []).filter(a => a.asset_type === 'port');
    const services = (assets || []).filter(a => a.asset_type === 'service');

    return NextResponse.json({ 
      targets: targets || [], 
      assets: actualAssets, 
      services: services, 
      ports: ports, 
      topology: topology || []
    });
  } catch (error) {
    console.error("Supabase fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch data from Supabase" }, { status: 500 });
  }
}
