import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    serviceRequired: {
      type: String,
      default: "",
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ContactEnquiry ||
  mongoose.model("ContactEnquiry", contactEnquirySchema);