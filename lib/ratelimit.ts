import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limiting. Uses Upstash Redis when configured (shared across serverless instances);
 * otherwise falls back to an in-memory limiter so production is never left completely unprotected.
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;

const upstash = new Map<string, Ratelimit>();
const memory = new Map<string, number[]>();

export async function rateLimit(key: string, limit = 5, windowMinutes = 10): Promise<boolean> {
  try {
    if (redis) {
      const id = `${limit}/${windowMinutes}`;
      let rl = upstash.get(id);
      if (!rl) {
        rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(limit, `${windowMinutes} m`), prefix: `zordev:${id}` });
        upstash.set(id, rl);
      }
      return (await rl.limit(key)).success;
    }
  } catch (e) {
    console.error("[ratelimit] Upstash unavailable, using in-memory fallback", e);
  }

  const now = Date.now();
  const windowMs = windowMinutes * 60_000;
  const hits = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    memory.set(key, hits);
    return false;
  }
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 5000) memory.delete(memory.keys().next().value as string); // bound memory
  return true;
}

/** Best client IP behind Vercel / Cloudflare proxies. */
export function clientIp(h: Headers) {
  return (
    h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
