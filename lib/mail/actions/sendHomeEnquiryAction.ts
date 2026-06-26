"use server";

import { sendMail } from "../sendMail";
import {
  HomeEnquiryEmail,
  HomeEnquiryEmailProps,
} from "../templates/homeEnquiry";
import { HomeEnquiryFormValues } from "../../validations/homeEnquirySchema";
import ContactEnquiry from "@/app/models/HomeEnquiry";
import { getToEmail } from "../../services/getToMail.service";
import connectDB from "../../mongodb";

export async function sendHomeEnquiryAction(data: HomeEnquiryFormValues) {
  try {
    // Optional: basic validation safety
    if (!data.email || !data.firstName) {
      return { success: false, message: "Missing required fields" };
    }

    const props: HomeEnquiryEmailProps = {
      firstName: data.firstName,
      forCompany: data.forCompany,
      email: data.email,
      phone: data.phone,
      details: data.details || "",
    };

    await connectDB();
    await ContactEnquiry.create(data);

    const toEmail = await getToEmail("contact");
    await sendMail<HomeEnquiryEmailProps>({
      to: toEmail,
      subject: `New Enquiry from ${data.firstName}`,
      template: HomeEnquiryEmail,
      props: data,
    });

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error: any) {
    console.error("Contact Action Error:", error);

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
