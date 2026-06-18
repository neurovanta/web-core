import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Home from "@/app/models/Home";
import Systems from "@/app/models/Systems";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await connectDB();

    const doc = await Home.findOne({});

    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const systemsDoc = await Systems.findOne({});
    const categories =
      systemsDoc?.secondSection?.categories?.map(
        (cat: {
          _id: unknown;
          title: string;
          products: { _id: unknown; thumbnailTitle: string }[];
        }) => ({
          _id: cat._id,
          title: cat.title,
          products: cat.products.map((p) => ({
            _id: p._id,
            thumbnailTitle: p.thumbnailTitle,
          })),
        }),
      ) ?? [];

    return NextResponse.json(
      { data: doc, categories, message: "Home fetched successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const updated = await Home.findOneAndUpdate({}, body, {
      upsert: true,
      new: true,
    });

    revalidateTag("Home", "default");

    return NextResponse.json(
      { data: updated, message: "Home page updated successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
