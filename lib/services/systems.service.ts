import connectDB from "@/lib/mongodb";
import SystemsModel from "@/app/models/Systems";
import { unstable_cache } from "next/cache";

export const getSystems = unstable_cache(
  async () => {
    await connectDB();

    const doc = await SystemsModel.findOne({}).lean();

    if (!doc) throw new Error("Systems not found");

    return JSON.parse(JSON.stringify(doc));
  },
  ["systems"],
  { tags: ["systems"] },
);

export const getSystemProductBySlug = unstable_cache(
  async (slug: string) => {
    await connectDB();

    const doc = (await SystemsModel.findOne({}).lean()) as any;

    if (!doc) throw new Error("Systems not found");

    for (const cat of doc.secondSection.categories) {
      const found = cat.products.find((p: any) => p.slug === slug);
      if (found) return JSON.parse(JSON.stringify(found));
    }

    throw new Error(`Product not found: ${slug}`);
  },
  ["system-product-slug"],
  { tags: ["systems"] },
);
