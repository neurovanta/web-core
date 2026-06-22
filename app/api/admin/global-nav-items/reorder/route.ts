import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import GlobalNavItems from "@/app/models/GlobalNavItems";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function PATCH(request: NextRequest) {
  const session = await mongoose.startSession();
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { menuItems } = await request.json();
    if (!Array.isArray(menuItems))
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });

    for (const item of menuItems) {
      if (item.kind === "link" && !item.label) {
        return NextResponse.json(
          { message: "Link items require a label" },
          { status: 400 },
        );
      }
      if (item.kind === "group" && !item.groupKey) {
        return NextResponse.json(
          { message: "Group items require a groupKey" },
          { status: 400 },
        );
      }
    }

    await connectDB();

    let result: InstanceType<typeof GlobalNavItems> | undefined;
    await session.withTransaction(async () => {
      let settings = await GlobalNavItems.findOne({}).session(session);
      if (!settings) {
        settings = new GlobalNavItems({});
        await settings.save({ session });
      }
      settings.header.menuItems = menuItems;
      await settings.save({ session });
      result = settings;
    });

    revalidateTag("Global-nav-items", "default");
    return NextResponse.json({ message: "Order saved", data: result?.header?.menuItems });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    await session.endSession();
  }
}