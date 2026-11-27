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

    // The enquiry is saved at this point, so the visitor gets a success even if the
    // notification email fails (it is logged; the enquiry shows on the admin dashboard).
    // Reporting it as a failure would make visitors resubmit and create duplicates.
    try {
      // Settings → "To email (Home)"
      const toEmail = await getToEmail("home");
      await sendMail<HomeEnquiryEmailProps>({
        to: toEmail,
        subject: `New Enquiry from ${data.firstName}`,
        template: HomeEnquiryEmail,
        props: data,
      });
    } catch (mailError) {
      console.error("Home enquiry saved but notification email failed:", mailError);
    }

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("Contact Action Error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
