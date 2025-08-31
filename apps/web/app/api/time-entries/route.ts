import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';
import { z } from 'zod';

const timeEntrySchema = z.object({
  project_id: z.string().uuid(),
  type: z.enum(['stamp', 'pause']),
  start_at: z.string()
});

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  // optional query param project
  const url = new URL(req.url);
  const projectId = url.searchParams.get('project');
  const query = supabase.from('time_entries').select('*');
  if (projectId) query.eq('project_id', projectId);
  const { data, error } = await query.order('inserted_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const json = await req.json();
  const result = timeEntrySchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors }, { status: 400 });
  }
  const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000002';
  const { project_id, type, start_at } = result.data;
  const { data, error } = await supabase
    .from('time_entries')
    .insert({ user_id: userId, project_id, type, start_at })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}