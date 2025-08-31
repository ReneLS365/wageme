import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';
import { generateCsv } from '@/packages/exports/generateCsv';
import { generateXlsx } from '@/packages/exports/generateXlsx';
import { generatePdf } from '@/packages/exports/generatePdf';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const url = new URL(req.url);
  const projectId = url.searchParams.get('project');
  const type = url.searchParams.get('type') ?? 'csv';
  if (!projectId) {
    return NextResponse.json({ error: 'project parameter er påkrævet' }, { status: 400 });
  }
  // hent tidsregistreringer
  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('project_id', projectId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // generer eksport
  if (type === 'csv') {
    const csv = generateCsv(entries as any[]);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="export.csv"'
      }
    });
  }
  if (type === 'xlsx') {
    const buffer = generateXlsx(entries as any[]);
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="export.xlsx"'
      }
    });
  }
  if (type === 'pdf') {
    const pdfBuffer = await generatePdf(entries as any[]);
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="export.pdf"'
      }
    });
  }
  return NextResponse.json({ error: 'Ukendt eksportformat' }, { status: 400 });
}