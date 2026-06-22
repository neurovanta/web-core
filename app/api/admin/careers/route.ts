import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Careers from "@/app/models/Careers";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await connectDB();

    const doc = await Careers.findOne({});

    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: doc, message: "Careers fetched successfully" },
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
    const id = request.nextUrl.searchParams.get("id");

    let doc = await Careers.findOne({});
    if (!doc) {
      doc = await Careers.create({});
    }

    if (id) {
      const job = doc.secondSection.jobs.find(
        (j: { _id: { toString: () => string } }) => j._id.toString() === id,
      );
      if (!job) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
      }
      Object.assign(job, body);
      await doc.save();
      revalidateTag("Careers", "default");
      return NextResponse.json(
        { data: job, message: "Job updated successfully" },
        { status: 200 },
      );
    }

    const flatSet: Record<string, unknown> = {};

    for (const [sectionKey, sectionValue] of Object.entries(body)) {
      if (
        typeof sectionValue === "object" &&
        sectionValue !== null &&
        !Array.isArray(sectionValue)
      ) {
        for (const [fieldKey, fieldValue] of Object.entries(
          sectionValue as Record<string, unknown>,
        )) {
          flatSet[`${sectionKey}.${fieldKey}`] = fieldValue;
        }
      } else {
        flatSet[sectionKey] = sectionValue;
      }
    }

    const updated = await Careers.findOneAndUpdate(
      {},
      { $set: flatSet },
      { upsert: true, new: true },
    );

    revalidateTag("Careers", "default");
    return NextResponse.json(
      { data: updated, message: "Careers page updated successfully" },
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

    let doc = await Careers.findOne({});
    if (!doc) {
      doc = await Careers.create({});
    }

    doc.secondSection.jobs.push(body);
    await doc.save();
    revalidateTag("Careers", "default");

    return NextResponse.json(
      { data: doc, message: "Job created successfully" },
      { status: 201 },
    );
  } catch (error: unknown) {
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
      return NextResponse.json({ message: "Job ID required" }, { status: 400 });
    }

    const doc = await Careers.findOne({});
    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const index = doc.secondSection.jobs.findIndex(
      (j: { _id: { toString: () => string } }) => j._id.toString() === id,
    );
    if (index === -1) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    doc.secondSection.jobs.splice(index, 1);
    await doc.save();
    revalidateTag("Careers", "default");

    return NextResponse.json(
      { message: "Job deleted successfully" },
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
