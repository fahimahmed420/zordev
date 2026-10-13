let warned = false;

/**
 * Verifies a Cloudflare Turnstile token. When no secret is configured the check is skipped (with a one-time
 * warning) so the forms keep working; honeypot + rate limiting still apply. Network errors fail open too:
 * a Turnstile outage should not cost a real lead.
 */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (!warned && process.env.NODE_ENV === "production") {
      warned = true;
      console.warn("[turnstile] TURNSTILE_SECRET_KEY is not set: spam check skipped.");
    }
    return true;
  }
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch (e) {
    console.error("[turnstile] verification request failed, allowing", e);
    return true;
  }
}
