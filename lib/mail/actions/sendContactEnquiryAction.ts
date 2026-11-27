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

    // The enquiry is saved at this point, so the visitor gets a success even if the
    // notification email fails (it is logged; the enquiry shows on the admin dashboard).
    // Reporting it as a failure would make visitors resubmit and create duplicates.
    try {
      // Settings → "To email (Contact)"
      const toEmail = await getToEmail("contact");
      await sendMail<ContactEnquiryEmailProps>({
        to: toEmail,
        subject: `New Contact Enquiry from ${data.name}`,
        template: ContactEnquiryEmail,
        props: data,
      });
    } catch (mailError) {
      console.error("Contact enquiry saved but notification email failed:", mailError);
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
