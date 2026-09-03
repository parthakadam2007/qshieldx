import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`>>> DELETING SCAN JOB [${id}]`);

    const { data, error } = await supabase
      .from('scan_jobs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error || !data || data.length === 0) {
      console.warn(`Scan job [${id}] not found or delete failed.`);
      return NextResponse.json({ error: 'Target not found or unauthorized' }, { status: 404 });
    }

    // Since we have ON DELETE CASCADE on foreign keys, related assets, findings etc are deleted automatically.
    return NextResponse.json({
      success: true,
      message: 'Target and all associated data deleted successfully',
      stats: { deleted: data.length }
    });
  } catch (error: any) {
    console.error("Failed to delete target:", error);
    return NextResponse.json(
      { error: 'Failed to process target deletion' },
      { status: 500 }
    );
  }
}
