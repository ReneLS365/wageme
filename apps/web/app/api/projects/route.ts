import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';
import { z } from 'zod';

// Schema for creating/updating projects
const projectSchema = z.object({
  name: z.string().min(1, { message: 'Navn er påkrævet' }),
  description: z.string().optional()
});

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('projects').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }
  // In a real setup we would retrieve auth user from headers; here bruger vi en demo owner_id
  const ownerId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000001';
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: parsed.data.name,
      description: parsed.data.description,
      owner_id: ownerId
    })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}