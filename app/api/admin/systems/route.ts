import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Systems from "@/app/models/Systems";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const id = request.nextUrl.searchParams.get("id");
    const slug = request.nextUrl.searchParams.get("slug");
    const categoryId = request.nextUrl.searchParams.get("categoryId");

    const doc = await Systems.findOne({});

    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Get single product by id
    if (id) {
      for (const cat of doc.secondSection.categories) {
        const found = cat.products.find(
          (p: { _id: { toString: () => string } }) => p._id.toString() === id,
        );
        if (found) {
          return NextResponse.json(
            { data: found, message: "Product fetched successfully" },
            { status: 200 },
          );
        }
      }
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Get single product by slug
    if (slug) {
      for (const cat of doc.secondSection.categories) {
        const found = cat.products.find(
          (p: { slug: string }) => p.slug === slug,
        );
        if (found) {
          return NextResponse.json(
            { data: found, message: "Product fetched successfully" },
            { status: 200 },
          );
        }
      }
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Get all products in a category
    if (categoryId) {
      const cat = doc.secondSection.categories.find(
        (c: { _id: { toString: () => string } }) =>
          c._id.toString() === categoryId,
      );
      if (!cat) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { data: cat, message: "Category fetched successfully" },
        { status: 200 },
      );
    }

    // Get full systems doc
    return NextResponse.json(
      { data: doc, message: "Systems fetched successfully" },
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
    const id = request.nextUrl.searchParams.get("id"); // product id
    const categoryId = request.nextUrl.searchParams.get("categoryId");

    let doc = await Systems.findOne({});
    if (!doc) {
      doc = await Systems.create({});
    }

    // Update single product
    if (id) {
      for (const cat of doc.secondSection.categories) {
        const found = cat.products.find(
          (p: { _id: { toString: () => string } }) => p._id.toString() === id,
        );
        if (found) {
          Object.assign(found, body);
          await doc.save();
          revalidateTag("Systems", "default");
          revalidateTag("Home", "default");
          // revalidateTag(`product-${found.slug}`, "default");
          return NextResponse.json(
            { data: found, message: "Product updated successfully" },
            { status: 200 },
          );
        }
      }
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Update category (e.g. isHidden toggle)
    if (categoryId) {
      const cat = doc.secondSection.categories.find(
        (c: { _id: { toString: () => string } }) =>
          c._id.toString() === categoryId,
      );
      if (!cat) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 },
        );
      }
      Object.assign(cat, body);
      await doc.save();
      revalidateTag("Systems", "default");
      revalidateTag("Home", "default");
      return NextResponse.json(
        { data: cat, message: "Category updated successfully" },
        { status: 200 },
      );
    }

    // Update main systems doc
    const updated = await Systems.findOneAndUpdate({}, body, {
      upsert: true,
      new: true,
    });
    revalidateTag("Systems", "default");
    revalidateTag("Home", "default");
    return NextResponse.json(
      { data: updated, message: "Systems page updated successfully" },
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
    const categoryId = request.nextUrl.searchParams.get("categoryId");

    let doc = await Systems.findOne({});
    if (!doc) {
      doc = await Systems.create({});
    }

    // Add new product to a category
    if (categoryId) {
      const cat = doc.secondSection.categories.find(
        (c: { _id: { toString: () => string } }) =>
          c._id.toString() === categoryId,
      );
      if (!cat) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 },
        );
      }
      cat.products.push(body);
      await doc.save();
      revalidateTag("Systems", "default");
      revalidateTag("Home", "default");
      return NextResponse.json(
        { data: doc, message: "Product created successfully" },
        { status: 201 },
      );
    }

    // Add new category
    doc.secondSection.categories.push(body);
    await doc.save();
    revalidateTag("Systems", "default");
    revalidateTag("Home", "default");
    return NextResponse.json(
      { data: doc, message: "Category created successfully" },
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
    const categoryId = request.nextUrl.searchParams.get("categoryId");

    const doc = await Systems.findOne({});
    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Delete single product
    if (id) {
      for (const cat of doc.secondSection.categories) {
        const index = cat.products.findIndex(
          (p: { _id: { toString: () => string } }) => p._id.toString() === id,
        );
        if (index !== -1) {
          cat.products.splice(index, 1);
          await doc.save();
          revalidateTag("Systems", "default");
          revalidateTag("Home", "default");
          return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 },
          );
        }
      }
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Delete category and all its products
    if (categoryId) {
      const index = doc.secondSection.categories.findIndex(
        (c: { _id: { toString: () => string } }) => c._id.toString() === categoryId,
      );
      if (index === -1) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
      }
      doc.secondSection.categories.splice(index, 1);
      await doc.save();
      revalidateTag("Systems", "default");
      revalidateTag("Home", "default");
      return NextResponse.json(
        { message: "Category deleted successfully" },
        { status: 200 },
      );
    }

    return NextResponse.json({ message: "No target specified" }, { status: 400 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}