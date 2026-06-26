"use server";

import { sendMail } from "../sendMail";
import {
  ContactEnquiryEmail,
  ContactEnquiryEmailProps,
} from "../templates/contactEnquiry";
import { ContactEnquiryFormValues } from "../../validations/contactEnquirySchema";
import ContactEnquiry from "@/app/models/ContactEnquiry";
import { getToEmail } from "../../services/getToMail.service";
import connectDB from "../../mongodb";

export async function sendContactEnquiryAction(data: ContactEnquiryFormValues) {
  try {
    if (!data.email || !data.name) {
      return { success: false, message: "Missing required fields" };
    }

    const props: ContactEnquiryEmailProps = {
      name: data.name,
      serviceRequired: data.serviceRequired,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.message || "",
    };

    await connectDB();
    await ContactEnquiry.create(data);

    const toEmail = await getToEmail("contact");
    await sendMail<ContactEnquiryEmailProps>({
      to: toEmail,
      subject: `New Contact Enquiry from ${data.name}`,
      template: ContactEnquiryEmail,
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
