import connectDB from "@/lib/mongodb";
import ContactModel from "@/app/models/Contact";
import { unstable_cache } from "next/cache";

export const getContact = unstable_cache(
  async () => {
    await connectDB();

    const contact = await ContactModel.findOne({}).lean();

    if (!contact) throw new Error("Contact not found");

    return JSON.parse(JSON.stringify(contact));
  },
  ["contact"],
  { tags: ["contact"] },
);