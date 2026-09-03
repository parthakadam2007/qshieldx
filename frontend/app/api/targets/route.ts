import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newJob = {
      user_id: user.id,
      target_domain: payload.domain,
      status: "running",
      mode: "fast",
      organization_name: payload.organization_name,
      repository_url: payload.repository_url,
      industry: payload.industry,
      shelf_life_years: payload.shelf_life_years,
      business_criticality: payload.business_criticality,
      scan_configuration: payload.scan_configuration || {},
    };

    const { data: result, error } = await supabase
      .from('scan_jobs')
      .insert(newJob)
      .select()
      .single();
      
    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, target: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add target:", error);
    return NextResponse.json(
      { error: 'Failed to create target' },
      { status: 500 }
    );
  }
}
