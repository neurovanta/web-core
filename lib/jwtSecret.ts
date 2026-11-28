// Key for signing / verifying admin session tokens. There is deliberately no
// fallback: without JWT_SECRET, logins are refused and every token is rejected,
// instead of silently using a guessable default that would let anyone forge one.
export function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not set; admin authentication is disabled.");
    return null;
  }
  return new TextEncoder().encode(secret);
}
