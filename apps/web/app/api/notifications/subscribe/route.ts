import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';
import { z } from 'zod';

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string(), auth: z.string() })
});

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const parsed = subscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }
  const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000002';
  const { endpoint, keys } = parsed.data;
  const { error } = await supabase.from('notification_subscriptions').insert({
    user_id: userId,
    endpoint,
    keys
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}