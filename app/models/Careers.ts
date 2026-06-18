import mongoose from "mongoose";

const careersSchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  bannerSection: {
    isHidden: { type: Boolean, default: false },
    image: { type: String },
    imageAlt: { type: String },
    title: { type: String },
  },
  firstSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
  secondSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    contactLabel: { type: String },
    contactEmail: { type: String },
    jobs: {
      type: [
        {
          isHidden: { type: Boolean, default: false },
          label: { type: String },
          designation: { type: String },
          type: { type: String },
          location: { type: String },
        },
      ],
      default: [],
    },
  },
  thirdSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    items: {
      type: [
        {
          image: { type: String },
          imageAlt: { type: String },
        },
      ],
      default: [],
    },
  },
});

export default mongoose.models.Careers ||
  mongoose.model("Careers", careersSchema);
