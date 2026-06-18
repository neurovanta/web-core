import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
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
    subtitle: { type: String },
    description: { type: String },
  },
  secondSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    items: {
      type: [
        {
          title: { type: String },
          description: { type: String },
          icon: { type: String },
          iconAlt: { type: String },
        },
      ],
      default: [],
    },
  },
  thirdSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    items: {
      type: [
        {
          title: { type: String },
          icon: { type: String },
          iconAlt: { type: String },
        },
      ],
      default: [],
    },
  },
  fourthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    items: {
      type: [
        {
          title: { type: String },
          image: { type: String },
          imageAlt: { type: String },
        },
      ],
      default: [],
    },
  },
  fifthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
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
  sixthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
});

export default mongoose.models.About || mongoose.model("About", aboutSchema);
