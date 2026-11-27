import connectDB from "@/lib/mongodb";
import Email from "@/app/models/Emails";

export async function getToEmail(type: string) {
  await connectDB();

  const emails = await Email.findOne({});
  if (!emails) {
    throw new Error("Email configuration not found");
  }

  const raw: string | undefined =
    type === "contact"
      ? emails.toEmailContact
      : type === "career"
        ? emails.toEmailCareer
        : type === "home"
          ? emails.toEmailHome || emails.toEmailContact // empty Home field: keep the old behaviour (Contact recipient)
          : undefined;
  if (!raw) throw new Error(`No recipient email configured for "${type}" (Admin > Settings)`);

  // Settings allows several recipients, comma separated
  const list = raw.split(",").map((e) => e.trim()).filter(Boolean);
  if (!list.length) throw new Error(`No recipient email configured for "${type}" (Admin > Settings)`);
  return list.length > 1 ? list : list[0];
}
