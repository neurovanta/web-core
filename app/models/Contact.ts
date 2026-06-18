import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
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
    office: {
      title: { type: String },
      address: { type: String },
      directionLabel: { type: String },
      directionHref: { type: String },
      mail: { type: String },
      phone: { type: String },
    },
  },
  secondSection: {
    isHidden: { type: Boolean, default: false },
    map: { type: String },
  },
});

export default mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);
