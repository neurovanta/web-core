import connectDB from "@/lib/mongodb";
import ExperienceModel from "@/app/models/Experience";
import { unstable_cache } from "next/cache";

export const getExperience = unstable_cache(
  async () => {
    await connectDB();

    const experience = await ExperienceModel.findOne({}).lean();

    if (!experience) throw new Error("Experience not found");

    return JSON.parse(JSON.stringify(experience));
  },
  ["experience"],
  { tags: ["experience"] },
);