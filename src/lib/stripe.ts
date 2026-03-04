import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const customer = await stripe.customers.create({ email, metadata: { supabase_user_id: userId } });
  return customer.id;
}
