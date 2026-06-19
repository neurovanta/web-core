import connectDB from "@/lib/mongodb";
import SolutionModel from "@/app/models/Solution";
import AboutModel from "@/app/models/About";
import { unstable_cache } from "next/cache";

export const getSolutions = unstable_cache(
  async () => {
    await connectDB();

    const doc = await SolutionModel.findOne({}).lean();

    if (!doc) throw new Error("Solutions not found");

    return JSON.parse(JSON.stringify(doc));
  },
  ["solutions"],
  { tags: ["solutions"] },
);

export const getSolutionBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      await connectDB();

      const AboutModel = (await import("@/app/models/About")).default;

      const [solutionDoc, aboutDoc] = await Promise.all([
        SolutionModel.findOne({}).lean() as any,
        AboutModel.findOne({}, { fourthSection: 1 }).lean() as any,
      ]);

      if (!solutionDoc) throw new Error("Solutions not found");
      if (!aboutDoc) throw new Error("About not found");

      const solution = solutionDoc.solutions.find((s: any) => s.slug === slug);

      if (!solution) throw new Error(`Solution not found: ${slug}`);

      return JSON.parse(JSON.stringify({
        ...solution,
        fifthSection: aboutDoc.fourthSection,
      }));
    },
    [`solution-slug-${slug}`],
    { tags: ["solutions"] },
  )();
