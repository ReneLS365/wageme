// Supabase Edge Function: Digest mail sender
// Denne funktion kører dagligt/ugentligt og sender en samlede oversigt over ændringer til hver bruger.
// Koden bruger Deno runtime og Supabase Functions API. For at teste lokalt kan du bruge `supabase functions serve`.

// Importer Edge Function helpers
import { serve } from 'https://deno.land/x/supabase_functions@v1/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Opret en service‑rolle klient; bruger service key fra miljøvariabler
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: { persistSession: false },
    global: {
      headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` }
    }
  }
);

// Helper: beregn tidspunkt for sidste kørsel (her: 24 timer siden)
function getSinceDate() {
  const date = new Date();
  date.setHours(date.getHours() - 24);
  return date.toISOString();
}

serve(async (_req) => {
  // Hent ændringer siden sidste dag
  const { data: changes, error } = await supabase
    .from('change_logs')
    .select('*')
    .gt('inserted_at', getSinceDate());
  if (error) {
    console.error('Kunne ikke hente ændringer', error);
    return new Response('error', { status: 500 });
  }
  const grouped: Record<string, any[]> = {};
  changes?.forEach((chg) => {
    const uid = chg.user_id;
    if (!uid) return;
    grouped[uid] = grouped[uid] || [];
    grouped[uid].push(chg);
  });
  // Send én mail pr. bruger (placeholder: gemme i export_jobs)
  for (const [uid, entries] of Object.entries(grouped)) {
    // opret en eksport job som repræsentation for email afsendelse
    await supabase.from('export_jobs').insert({
      project_id: entries[0].entity_id,
      type: 'csv',
      status: 'completed',
      requested_by: uid,
      url: null
    });
  }
  return new Response('OK', { status: 200 });
});