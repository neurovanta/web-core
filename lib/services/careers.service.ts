import connectDB from "@/lib/mongodb";
import CareersModel from "@/app/models/Careers";
import { unstable_cache } from "next/cache";

export const getCareers = unstable_cache(
  async () => {
    await connectDB();

    const careers = await CareersModel.findOne({}).lean();

    if (!careers) throw new Error("Careers not found");

    return JSON.parse(JSON.stringify(careers));
  },
  ["careers"],
  { tags: ["careers"] },
);