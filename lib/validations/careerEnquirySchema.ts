import { z } from "zod";

export const careerEnquirySchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Invalid phone number")
    .max(20, "Invalid phone number"),
  applyingFor: z.string().min(1, "Please select a position"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  additionalInfo: z.string().optional(),
  attachment: z
    .any()
    .refine((files) => files?.length === 1, "Attachment is required")
    .refine(
      (files) => !files?.[0] || files[0].size <= 5 * 1024 * 1024,
      "Maximum file size is 5 MB",
    )
    .refine(
      (files) =>
        !files?.[0] ||
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(files[0].type),
      "Only PDF or Word documents are allowed",
    ),
});

export type CareerEnquiryFormValues = z.infer<typeof careerEnquirySchema>;
