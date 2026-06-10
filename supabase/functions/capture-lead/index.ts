// Supabase Edge Function: capture-lead (DORMANT until GROWTH_LIVE).
// Stores an email + explicit consent. Double-opt-in ready. No pre-ticked boxes.
// Deploy: supabase functions deploy capture-lead
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const { email, source, magnet, consent } = await req.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'valid email required' }), { status: 400, headers: cors })
    }
    // consent must be explicitly true — never assumed.
    await supabase.from('leads').insert({
      email,
      source: source ?? 'web',
      magnet: magnet ?? null,
      consent_marketing: consent === true,
    })
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 400, headers: cors })
  }
})
