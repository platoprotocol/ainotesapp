export interface Note {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata?: Record<string, unknown>;
}

export type AIAction = 'summarize' | 'improve' | 'generate-title' | 'smart-tags' | 'expand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  result: string;
  tags?: string[];
  error?: string;
}

export interface UserPlan {
  user_id: string;
  plan: 'free' | 'pro';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  period_end: string | null;
  updated_at: string;
}

export interface AIUsage {
  user_id: string;
  month: string;
  count: number;
}

export const FREE_TIER_LIMIT = 20;
