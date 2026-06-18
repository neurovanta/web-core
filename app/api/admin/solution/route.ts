import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Solution from "@/app/models/Solution";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const id = request.nextUrl.searchParams.get("id");
    const slug = request.nextUrl.searchParams.get("slug");

    const doc = await Solution.findOne({});

    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (id) {
      const found = doc.solutions.find(
        (s: { _id: { toString: () => string } }) => s._id.toString() === id,
      );
      if (!found) {
        return NextResponse.json(
          { message: "Solution not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { data: found, message: "Solution fetched successfully" },
        { status: 200 },
      );
    }

    if (slug) {
      const found = doc.solutions.find(
        (s: { slug: string }) => s.slug === slug,
      );
      if (!found) {
        return NextResponse.json(
          { message: "Solution not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { data: found, message: "Solution fetched successfully" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { data: doc, message: "Solutions fetched successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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
    const id = request.nextUrl.searchParams.get("id");

    if (id) {
      const doc = await Solution.findOne({});
      if (!doc) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }

      const found = doc.solutions.find(
        (s: { _id: { toString: () => string } }) => s._id.toString() === id,
      );
      if (!found) {
        return NextResponse.json(
          { message: "Solution not found" },
          { status: 404 },
        );
      }

      Object.assign(found, body);
      await doc.save();

      revalidateTag("solutions", "default");
      revalidateTag(`solution-${found.slug}`, "default");

      return NextResponse.json(
        { data: found, message: "Solution updated successfully" },
        { status: 200 },
      );
    }

    const doc = await Solution.findOneAndUpdate({}, body, {
      upsert: true,
      new: true,
    });

    revalidateTag("solutions", "default");

    return NextResponse.json(
      { data: doc, message: "Solutions page updated successfully" },
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

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const doc = await Solution.findOne({});
    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    doc.solutions.push(body);
    await doc.save();

    revalidateTag("solutions", "default");

    return NextResponse.json(
      { data: doc, message: "Solution created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}