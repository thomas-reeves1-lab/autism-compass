// Supabase Edge Function: stripe-webhook (DORMANT until STORE_LIVE).
// Verifies the Stripe signature, then fulfils orders + updates subscriptions.
// Idempotent: keyed on stripe_session_id / stripe_sub_id unique columns.
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature')
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig!, webhookSecret)
  } catch (err) {
    return new Response(`Webhook signature failed: ${err}`, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session
      // Idempotent upsert keyed on the unique session id.
      await supabase.from('orders').upsert(
        {
          email: s.customer_details?.email ?? 'unknown',
          stripe_session_id: s.id,
          status: 'paid',
          total_cents: s.amount_total ?? 0,
        },
        { onConflict: 'stripe_session_id' },
      )
      // Digital fulfilment: unlock premium/practitioner (email an access link here).
      if (s.mode === 'subscription' && s.customer_details?.email) {
        await supabase.from('subscriptions').upsert(
          { email: s.customer_details.email, tier: 'premium', stripe_sub_id: String(s.subscription), status: 'active' },
          { onConflict: 'stripe_sub_id' },
        )
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('subscriptions')
        .update({ status: sub.status, current_period_end: new Date(sub.current_period_end * 1000).toISOString() })
        .eq('stripe_sub_id', sub.id)
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
