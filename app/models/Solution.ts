import mongoose from "mongoose";

const individualSolutionSchema = new mongoose.Schema({
  isHidden: { type: Boolean, default: false },
  slug: { type: String },
  thumbnailImage: { type: String },
  thumbnailImageAlt: { type: String },
  thumbnailTitle: { type: String },
  thumbnailDescription: { type: String },
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
    subTitle: { type: String },
    description: { type: String },
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
  sixthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
});

const solutionSchema = new mongoose.Schema({
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
  solutions: {
    type: [individualSolutionSchema],
    default: [],
  },
  thirdSection: {
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
  fourthSection: {
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
  fifthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
});

export default mongoose.models.Solution ||
  mongoose.model("Solution", solutionSchema);
