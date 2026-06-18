import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  firstSection: {
    isHidden: { type: Boolean, default: false },
    video: { type: String },
    videoAlt: { type: String },
    posterImage: { type: String },
    title: { type: String },
    buttons: {
      type: [
        {
          label: { type: String },
          href: { type: String },
        },
      ],
      default: [],
    },
  },
  secondSection: {
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
    categories: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Systems" }],
      default: [],
    },
    products: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      default: [],
    },
  },
  fifthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    button: {
      label: { type: String },
      href: { type: String },
    },
    items: {
      type: [
        {
          title: { type: String },
          value: { type: String },
          icon: { type: String },
          iconAlt: { type: String },
        },
      ],
      default: [],
    },
  },
  sixthSection: {
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
  seventhSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    items: {
      type: [
        {
          homeAnimatedIcon: { type: String },
          homeAnimatedIconAlt: { type: String },
          slug: { type: String },
          thumbnailTitle: { type: String },
        },
      ],
      default: [],
    },
  },
  eighthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    row1: {
      type: [
        {
          image: { type: String },
          imageAlt: { type: String },
        },
      ],
      default: [],
    },
    row2: {
      type: [
        {
          image: { type: String },
          imageAlt: { type: String },
        },
      ],
      default: [],
    },
    row3: {
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

export default mongoose.models.Home || mongoose.model("Home", homeSchema);
