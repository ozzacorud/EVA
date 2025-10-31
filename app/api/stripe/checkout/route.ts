import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { userId, pack } = await req.json(); // 'starter' | 'family'
  const amount = pack === 'family' ? 1499 : 499;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'eur', product_data: { name: `EVA pack ${pack}` }, unit_amount: amount }, quantity: 1 }],
    success_url: process.env.PUBLIC_URL + '/?success=true',
    cancel_url: process.env.PUBLIC_URL + '/?canceled=true',
    metadata: { userId, amount }
  });
  return NextResponse.json({ url: session.url });
}
