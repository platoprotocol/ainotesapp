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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface GamificationStats {
  xp: number;
  level: number;
  levelTitle: string;
  xpProgress: number;
  xpForNext: number;
  xpForCurrent: number;
  streak: { current: number; longest: number; lastActiveDate: string | null };
  stats: { totalNotes: number; totalWords: number; totalRecordings: number; totalAIActions: number };
  dailyActivity: Record<string, number>;
  achievements: Achievement[];
}
