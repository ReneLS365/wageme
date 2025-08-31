import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';

/**
 * Modtager events fra Scafix via postMessage. Payload forventes at indeholde project_id,
 * start_date, end_date og data for count sheet. Der oprettes både en count_sheet og et eksportjob.
 */
export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { project_id, start_date, end_date, data } = body;
  if (!project_id || !data) {
    return NextResponse.json({ error: 'Ugyldig payload' }, { status: 400 });
  }
  // Indsæt countsheet
  const { data: sheet, error: sheetErr } = await supabase
    .from('count_sheets')
    .insert({
      project_id,
      start_date,
      end_date,
      data,
      created_by: '00000000-0000-0000-0000-000000000001'
    })
    .select()
    .single();
  if (sheetErr) {
    return NextResponse.json({ error: sheetErr.message }, { status: 400 });
  }
  // Opret eksportjob
  await supabase.from('export_jobs').insert({
    project_id,
    type: 'csv',
    status: 'pending',
    requested_by: '00000000-0000-0000-0000-000000000001'
  });
  return NextResponse.json({ success: true, sheet });
}