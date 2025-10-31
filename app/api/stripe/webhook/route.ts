import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const buf = await req.text();
  let event: Stripe.Event;
  try {
    event = new Stripe(process.env.STRIPE_SECRET_KEY!).webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session;
    const userId = s.metadata?.userId!;
    const amount = Number(s.metadata?.amount || 0);
    await supabaseAdmin.from('transactions').insert({
      user_id: userId, kind: 'CREDIT_PURCHASE', amount_cents: amount, currency: 'EUR', meta: s as any
    });
  }
  return NextResponse.json({ received: true });
}
