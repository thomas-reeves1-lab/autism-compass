// Supabase Edge Function: create-checkout (DORMANT until STORE_LIVE).
// Creates a Stripe Checkout Session. No card data ever touches our servers.
// Deploy: supabase functions deploy create-checkout
// Secrets: STRIPE_SECRET_KEY, SITE_URL
//
// Body: { items: [{ stripePriceId, quantity }], mode: 'payment'|'subscription',
//         orderBumpPriceId?: string }
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})
const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const { items, mode = 'payment', orderBumpPriceId } = await req.json()
    const line_items = (items ?? []).map((i: { stripePriceId: string; quantity?: number }) => ({
      price: i.stripePriceId,
      quantity: i.quantity ?? 1,
    }))
    if (orderBumpPriceId) line_items.push({ price: orderBumpPriceId, quantity: 1 })

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items,
      // Stripe natively supports one-click upsells via the post-purchase page.
      success_url: `${SITE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/store`,
      allow_promotion_codes: true,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})
