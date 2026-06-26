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
      filePath = await uploadToDropbox(resume, `/resume/${applyingFor}/${filename}`);
    }

    await connectDB();
    await CareerEnquiry.create({
      firstName, lastName, email, phone,
      applyingFor, yearsOfExperience, additionalInfo,
      attachment: filePath,
    });

    const props: CareerEnquiryEmailProps = {
      firstName, lastName, email, phone,
      applyingFor, yearsOfExperience, additionalInfo,
    };

    const toEmail = await getToEmail("career");
    await sendMail<CareerEnquiryEmailProps>({
      to: toEmail,
      subject: `New Application from ${firstName} ${lastName}`,
      template: CareerEnquiryEmail,
      props,
      attachments: attachment ? [attachment] : [],
    });

    return { success: true, message: "Application sent successfully" };
  } catch (error: any) {
    console.error("Career Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}
