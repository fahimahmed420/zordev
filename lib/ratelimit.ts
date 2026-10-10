import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 5 submissions per IP per 10 minutes. Without Upstash credentials (local dev), limiting is skipped.
const limiter =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "10 m"), prefix: "zordev:contact" })
    : null;

export async function rateLimit(ip: string) {
  if (!limiter) return true;
  const { success } = await limiter.limit(ip);
  return success;
}
