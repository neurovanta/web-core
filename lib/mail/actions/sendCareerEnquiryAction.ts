"use server";

import { sendMail } from "../sendMail";
import {
  CareerEnquiryEmail,
  CareerEnquiryEmailProps,
} from "../templates/careerEnquiry";
import CareerEnquiry from "@/app/models/CareerEnquiry";
import connectDB from "../../mongodb";
import { getToEmail } from "@/lib/services/getToMail.service";
import { uploadToDropbox } from "@/lib/connectDropbox";
import { slugify } from "@/lib/slug";

export async function sendCareerEnquiryAction(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const applyingFor = formData.get("applyingFor") as string;
    const yearsOfExperience = formData.get("yearsOfExperience") as string;
    const additionalInfo = formData.get("additionalInfo") as string;
    const resume = formData.get("attachment") as File | null;

    if (!email || !firstName) {
      return { success: false, message: "Missing required fields" };
    }

    let attachment;
    let filePath = "";

    if (resume && resume.size > 0) {
      const bytes = await resume.arrayBuffer();
      const buffer = Buffer.from(bytes);
      attachment = {
        filename: resume.name,
        content: buffer.toString("base64"),  // ← base64 string
        contentType: resume.type,
      };


      const filename = `${Date.now()}-${resume.name}`;
      // job titles can contain "/" (e.g. "UI/UX Designer"); keep the Dropbox folder flat
      const folder = slugify(applyingFor || "") || "general";
      filePath = await uploadToDropbox(resume, `/resume/${folder}/${filename}`);
    }

    await connectDB();
    await CareerEnquiry.create({
      firstName, lastName, email, phone,
      applyingFor, yearsOfExperience, additionalInfo,
      attachmentUrl: filePath, // model field is attachmentUrl (was saved as "attachment" and silently dropped)
    });

    const props: CareerEnquiryEmailProps = {
      firstName, lastName, email, phone,
      applyingFor, yearsOfExperience, additionalInfo,
    };

    // The application is saved at this point, so the visitor gets a success even if the
    // notification email fails (it is logged; the application shows in Admin > Careers > Applications).
    // Reporting it as a failure would make visitors resubmit and create duplicates.
    try {
      // Settings → "To email (Career)"
      const toEmail = await getToEmail("career");
      await sendMail<CareerEnquiryEmailProps>({
        to: toEmail,
        subject: `New Application from ${firstName} ${lastName}`,
        template: CareerEnquiryEmail,
        props,
        attachments: attachment ? [attachment] : [],
      });
    } catch (mailError) {
      console.error("Career application saved but notification email failed:", mailError);
    }

    return { success: true, message: "Application sent successfully" };
  } catch (error) {
    console.error("Career Action Error:", error);
    // never send internal error text (DB / Dropbox / Resend details) to the visitor
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
