type RateLimitEntry = { count: number; resetAt: number };

const buckets = new Map<string, RateLimitEntry>();

/** Best-effort process-local limiter for serverless routes; use an edge/Redis limiter for multi-instance guarantees. */
export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: windowMs };
  }

  if (current.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, current.resetAt - now) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: Math.max(1, current.resetAt - now) };
}

export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return `${scope}:${forwarded || realIp || "unknown"}`;
}
