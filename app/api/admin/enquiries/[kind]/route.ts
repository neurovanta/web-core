import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import HomeEnquiry from "@/app/models/HomeEnquiry";
import ContactEnquiry from "@/app/models/ContactEnquiry";
import CareerEnquiry from "@/app/models/CareerEnquiry";

// Admin enquiry lists: /api/admin/enquiries/home | contact | career
const MODELS = {
  home: HomeEnquiry,
  contact: ContactEnquiry,
  career: CareerEnquiry,
} as const;

type Ctx = { params: Promise<{ kind: string }> };

const getModel = async (ctx: Ctx) => {
  const { kind } = await ctx.params;
  return MODELS[kind as keyof typeof MODELS] ?? null;
};

export async function GET(request: NextRequest, ctx: Ctx) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const Model = await getModel(ctx);
  if (!Model) return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    await connectDB();
    const data = await Model.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching enquiries", error);
    return NextResponse.json({ message: "Failed to load enquiries" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const Model = await getModel(ctx);
  if (!Model) return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    const { id } = await request.json();
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid enquiry id" }, { status: 400 });
    }
    await connectDB();
    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Enquiry deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting enquiry", error);
    return NextResponse.json({ message: "Failed to delete enquiry" }, { status: 500 });
  }
}
