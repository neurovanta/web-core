import connectDB from "@/lib/mongodb";
import IndustriesModel from "@/app/models/industries";
import { unstable_cache } from "next/cache";

export const getIndustries = unstable_cache(
  async () => {
    await connectDB();

    const doc = await IndustriesModel.findOne({}).lean();

    if (!doc) throw new Error("Industries not found");

    return JSON.parse(JSON.stringify(doc));
  },
  ["Industries"],
  { tags: ["Industries"] },
);

export const getIndustryBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      await connectDB();

      const doc = (await IndustriesModel.findOne({}).lean()) as any;

      if (!doc) throw new Error("Industries not found");

      const found = doc.industries.find((i: any) => i.slug === slug);

      if (!found) throw new Error(`Industry not found: ${slug}`);

      return JSON.parse(JSON.stringify(found));
    },
    ["Industry-slug", slug],
    { tags: ["Industries"] },
  )();
