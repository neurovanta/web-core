import { cookies } from "next/headers";
import * as jose from "jose";
import { getJwtSecret } from "@/lib/jwtSecret";
import connectDB from "@/lib/mongodb";
import Admin from "@/app/models/Admin";

/**
 * Returns the signed-in admin's username from the adminToken cookie,
 * or null if the token is missing/invalid. Never throws.
 */
export async function getCurrentAdminName(): Promise<string | null> {
  try {
    const token = (await cookies()).get("adminToken")?.value;
    if (!token) return null;

    const secret = getJwtSecret();
    if (!secret) return null;
    const { payload } = await jose.jwtVerify(token, secret);
    if (!payload.userId) return null;

    await connectDB();
    const admin = (await Admin.findById(payload.userId)
      .select("username")
      .lean()) as { username?: string } | null;
    return admin?.username ?? null;
  } catch {
    return null;
  }
}
