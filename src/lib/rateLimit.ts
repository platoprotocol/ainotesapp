// In-memory per-IP limiter (resets on cold start — sufficient for basic protection)
const store = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(key: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
