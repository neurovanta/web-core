import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/search";

// Fetched by the header only when search is first opened. The data comes from the
// tag-cached CMS services, so this does not query MongoDB per request.
export async function GET() {
  const items = await getSearchIndex();
  return NextResponse.json(items);
}
