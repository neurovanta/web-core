import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { getAdminSearchIndex } from "@/lib/search";

// CMS command-palette index: includes hidden items, so it is admin-only.
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const items = await getAdminSearchIndex();
  return NextResponse.json(items);
}
