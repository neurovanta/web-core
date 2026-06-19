import { NextRequest, NextResponse } from "next/server";
import { getDropboxInstance } from "@/lib/connectDropbox";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function POST(request: NextRequest) {
  const isAdmin = verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, fileType } = await request.json();

  const filePath = `/uploads/${fileType}/${Date.now()}${fileName
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9.-]/g, "")}`;

  const dropbox = await getDropboxInstance();
  const result = await dropbox.filesGetTemporaryUploadLink({
    commit_info: {
      path: filePath,
      mode: { ".tag": "overwrite" },
      autorename: true,
    },
    duration: 3600,
  });

  return NextResponse.json({ uploadUrl: result.result.link, filePath });
}