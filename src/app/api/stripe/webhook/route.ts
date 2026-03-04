import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook verification failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const sub = event.data.object as Stripe.Subscription;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const isActive = sub.status === 'active' || sub.status === 'trialing';
      await supabaseAdmin
        .from('user_plans')
        .update({
          plan: isActive ? 'pro' : 'free',
          stripe_subscription_id: sub.id,
          status: sub.status,
          period_end: new Date((sub as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', sub.customer as string);
      break;
    }
    case 'customer.subscription.deleted': {
      await supabaseAdmin
        .from('user_plans')
        .update({
          plan: 'free',
          stripe_subscription_id: null,
          status: 'canceled',
          period_end: null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', sub.customer as string);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
