import mongoose from "mongoose";

const individualIndustrySchema = new mongoose.Schema({
  isHidden: { type: Boolean, default: false },
  slug: { type: String },
  thumbnailImage: { type: String },
  thumbnailImageAlt: { type: String },
  thumbnailTitle: { type: String },
  thumbnailDescription: { type: String },
  homeAnimatedIcon: { type: String },
  homeAnimatedIconAlt: { type: String },
  homeAnimatedMobIcon: { type: String },
  homeAnimatedMobIconAlt: { type: String },
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
    image: { type: String },
    imageAlt: { type: String },
  },
  fifthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
});

const industriesSchema = new mongoose.Schema({
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
  },
  industries: {
    type: [individualIndustrySchema],
    default: [],
  },
  thirdSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
});

export default mongoose.models.Industries ||
  mongoose.model("Industries", industriesSchema);
