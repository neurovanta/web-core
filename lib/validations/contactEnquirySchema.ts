import { z } from "zod";

export const contactEnquirySchema = z.object({
  name: z.string().min(2, "Name is required"),

  email: z.string().email("Invalid email address"),

  serviceRequired: z.string().min(1, "Please select a service"),

  phoneNumber: z
    .string()
    .min(7, "Invalid phone number")
    .max(20, "Invalid phone number"),

  message: z.string().min(1, "Message is required"),
});

export type ContactEnquiryFormValues = z.infer<typeof contactEnquirySchema>;