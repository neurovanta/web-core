import connectDB from "@/lib/mongodb";
import Email from "@/app/models/Emails";

export async function getToEmail(type: string) {
  await connectDB();

  const emails = await Email.findOne({});
  if (!emails) {
    throw new Error("Email configuration not found");
  }

  switch (type) {
    case "contact":
      return emails.toEmailContact;

    case "career":
      return emails.toEmailCareer;

    case "home":
      return emails.toEmailHome;

    default:
      return null;
  }
}
