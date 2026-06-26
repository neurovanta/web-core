import mongoose from "mongoose";

const careerEnquirySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    applyingFor: { type: String, required: true, trim: true },
    yearsOfExperience: { type: String, required: true, trim: true },
    additionalInfo: { type: String, default: "", trim: true },
    attachmentUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.CareerEnquiry ||
  mongoose.model("CareerEnquiry", careerEnquirySchema);
