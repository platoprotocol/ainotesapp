CREATE TABLE IF NOT EXISTS public.user_plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  status text DEFAULT 'active',
  period_end timestamptz,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own plan" ON public.user_plans FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.ai_usage (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  month text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, month)
);
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own usage" ON public.ai_usage FOR SELECT USING (auth.uid() = user_id);
