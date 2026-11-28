import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/slug";
import connectDB from "@/lib/mongodb";
import Industries from "@/app/models/industries";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const id = request.nextUrl.searchParams.get("id");
    const slug = request.nextUrl.searchParams.get("slug");

    const doc = await Industries.findOne({});

    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (id) {
      const found = doc.industries.find(
        (s: { _id: { toString: () => string } }) => s._id.toString() === id,
      );
      if (!found) {
        return NextResponse.json(
          { message: "Industry not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { data: found, message: "Industry fetched successfully" },
        { status: 200 },
      );
    }

    if (slug) {
      const found = doc.industries.find(
        (s: { slug: string }) => s.slug === slug,
      );
      if (!found) {
        return NextResponse.json(
          { message: "Industry not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { data: found, message: "Industry fetched successfully" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { data: doc, message: "Industries fetched successfully" },
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
    // store slugs URL-safe: "Immersion Tubs" -> "immersion-tubs"
    if (typeof body.slug === "string") body.slug = slugify(body.slug);
    const id = request.nextUrl.searchParams.get("id");

    if (id) {
      const doc = await Industries.findOne({});
      if (!doc) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
      }

      const found = doc.industries.find(
        (s: { _id: { toString: () => string } }) => s._id.toString() === id,
      );
      if (!found) {
        return NextResponse.json(
          { message: "Industry not found" },
          { status: 404 },
        );
      }

      Object.assign(found, body);
      await doc.save();

      revalidateTag("Industries", "default");
      revalidateTag("Home", "default");
      revalidateTag("Global-nav-items", "default");
      // revalidateTag(`Industry-slug-${found.slug}`, "default");

      return NextResponse.json(
        { data: found, message: "Industry updated successfully" },
        { status: 200 },
      );
    }

    // Page save: the industries list is managed item by item (add / edit / hide / delete have their own
    // requests), so never overwrite it here - a stale copy from the page form would undo those changes.
    delete body.industries;
    const doc = await Industries.findOneAndUpdate({}, body, {
      upsert: true,
      returnDocument: "after",
    });

    revalidateTag("Industries", "default");
    revalidateTag("Home", "default");
    revalidateTag("Global-nav-items", "default");

    return NextResponse.json(
      { data: doc, message: "Industries page updated successfully" },
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
    // store slugs URL-safe: "Immersion Tubs" -> "immersion-tubs"
    if (typeof body.slug === "string") body.slug = slugify(body.slug);

    const doc = await Industries.findOne({});
    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    doc.industries.push(body);
    await doc.save();

    revalidateTag("Industries", "default");
    revalidateTag("Home", "default");
    revalidateTag("Global-nav-items", "default");

    return NextResponse.json(
      { data: doc, message: "Industry created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "No id specified" }, { status: 400 });
    }

    const doc = await Industries.findOne({});
    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const index = doc.industries.findIndex(
      (s: { _id: { toString: () => string } }) => s._id.toString() === id,
    );
    if (index === -1) {
      return NextResponse.json(
        { message: "Industry not found" },
        { status: 404 },
      );
    }

    doc.industries.splice(index, 1);
    await doc.save();
    revalidateTag("Industries", "default");
    revalidateTag("Home", "default");
    revalidateTag("Global-nav-items", "default");

    return NextResponse.json(
      { message: "Industry deleted successfully" },
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
