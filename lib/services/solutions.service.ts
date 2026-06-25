import connectDB from "@/lib/mongodb";
import SolutionModel from "@/app/models/Solution";
import { unstable_cache } from "next/cache";

export const getSolutions = unstable_cache(
  async () => {
    await connectDB();

    const doc = await SolutionModel.findOne({}).lean();

    if (!doc) throw new Error("Solutions not found");

    return JSON.parse(JSON.stringify(doc));
  },
  ["Solutions"],
  { tags: ["Solutions"] },
);

export const getSolutionBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      await connectDB();

      const solutionDoc = await SolutionModel.findOne({}).lean() as any;

      if (!solutionDoc) throw new Error("Solutions not found");

      const solution = solutionDoc.solutions.find((s: any) => s.slug === slug);

      if (!solution) throw new Error(`Solution not found: ${slug}`);

      return JSON.parse(JSON.stringify(solution));
    },
    [`Solution-slug-${slug}`],
    { tags: ["Solutions"] },
  )();
