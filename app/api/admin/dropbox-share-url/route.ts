import { NextRequest, NextResponse } from "next/server";
import { getDropboxInstance } from "@/lib/connectDropbox";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function POST(request: NextRequest) {
  const isAdmin = verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filePath } = await request.json();
  const dropbox = await getDropboxInstance();

  const result = await dropbox.sharingCreateSharedLinkWithSettings({
    path: filePath,
    settings: { requested_visibility: { ".tag": "public" } },
  });

  const url = result.result.url.replace(
    "www.dropbox.com",
    "dl.dropboxusercontent.com",
  );
  return NextResponse.json({ url });
}
