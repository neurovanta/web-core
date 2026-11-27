import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { PERMANENT_REDIRECTS } from "@/lib/redirects";

const ADMIN_BASE = "/4dm1n-n3ur0v4nt4";
const ADMIN_LOGIN = `${ADMIN_BASE}/login`;

const isValidToken = async (token: string | undefined) => {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
    await jose.jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Changed URLs (e.g. a slug renamed in the CMS): 301 to the new address, keeping the query string.
  const redirectTo = PERMANENT_REDIRECTS[pathname];
  if (redirectTo) {
    const url = new URL(redirectTo, request.url);
    url.search = search;
    return NextResponse.redirect(url, 301);
  }

  // 2. Admin console: every page except the login needs a valid token;
  //    a signed-in admin opening the login page goes to the dashboard.
  //    (API routes check the token themselves with verifyAdmin.)
  const isAdmin = pathname === ADMIN_BASE || pathname.startsWith(`${ADMIN_BASE}/`);
  if (isAdmin) {
    const signedIn = await isValidToken(request.cookies.get("adminToken")?.value);
    if (pathname === ADMIN_LOGIN) {
      if (signedIn) return NextResponse.redirect(new URL(ADMIN_BASE, request.url));
    } else if (!signedIn) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // admin pages (auth guard)
    "/4dm1n-n3ur0v4nt4/:path*",
    // detail pages whose URLs can change (PERMANENT_REDIRECTS in lib/redirects.ts)
    "/industries/:path*",
    "/solutions/:path*",
    "/longevity-systems/:path*",
  ],
};
