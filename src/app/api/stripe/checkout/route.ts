import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, getOrCreateStripeCustomer } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get existing customer id or create new one
  const { data: planRow } = await supabaseAdmin
    .from('user_plans')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  let customerId = planRow?.stripe_customer_id as string | null;
  if (!customerId) {
    customerId = await getOrCreateStripeCustomer(user.id, user.email!);
    // Upsert customer id into user_plans
    await supabaseAdmin
      .from('user_plans')
      .upsert(
        { user_id: user.id, stripe_customer_id: customerId, plan: 'free' },
        { onConflict: 'user_id' }
      );
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/notes?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/notes`,
  });

  return NextResponse.json({ url: session.url });
}
