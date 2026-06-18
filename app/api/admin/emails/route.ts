import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Email from "@/app/models/Emails";

export async function GET() {
  try {
    await connectDB();
    const emails = await Email.findOne({});
    if (!emails) {
      return NextResponse.json(
        { message: "Emails not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { data: emails, message: "Emails fetched successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const emails = await Email.findOneAndUpdate(
      {},
      {
        toEmailContact: body.toEmailContact,
        toEmailCareer: body.toEmailCareer,
        toEmailHome: body.toEmailHome,
      },
      { upsert: true, new: true },
    );
    if (!emails) {
      return NextResponse.json(
        { message: "Emails not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { data: emails, message: "Emails updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
