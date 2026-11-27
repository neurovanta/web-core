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
  ["Systems"],
  { tags: ["Systems"] },
);

export const getSystemProductBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      await connectDB();

      const doc = (await SystemsModel.findOne({}).lean()) as any;

      if (!doc) throw new Error("Systems not found");

      for (const cat of doc.secondSection.categories) {
        const found = cat.products.find((p: any) => p.slug === slug);
        if (found) {
          // hidden product or hidden category → null, the page renders a 404
          if (found.isHidden || cat.isHidden) return null;
          return JSON.parse(JSON.stringify(found));
        }
      }

      return null;
    },
    ["System-product-slug", slug],
    { tags: ["Systems"] },
  )();