import { NextRequest } from "next/server";
import * as jose from "jose";
import { getJwtSecret } from "@/lib/jwtSecret";

export async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("adminToken")?.value || "";

  if (!token) {
    return false;
  }

  try {
    const secret = getJwtSecret();
    if (!secret) return false;
    await jose.jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
