import { z } from "zod";

export const homeEnquirySchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is required"),

  forCompany: z.string().min(1, "Company is required"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(7, "Invalid phone number")
    .max(20, "Invalid phone number"),

  details: z.string().optional(),
});

export type HomeEnquiryFormValues = z.infer<typeof homeEnquirySchema>;