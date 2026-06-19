import mongoose from "mongoose";

const individualProductSchema = new mongoose.Schema({
  isHidden: { type: Boolean, default: false },
  slug: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Systems" },
  thumbnailImage: { type: String },
  thumbnailImageAlt: { type: String },
  thumbnailTitle: { type: String },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  bannerSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    imageAlt: { type: String },
    image: { type: String },
  },
  firstSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    subTitle: { type: String },
    description: { type: String },
  },
  secondSection: {
    isHidden: { type: Boolean, default: false },
    items: {
      type: [
        {
          title: { type: String },
          description: { type: String },
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
          category: { type: String },
          title: { type: String },
          description: { type: String },
          items: {
            type: [
              {
                icon: { type: String },
                iconAlt: { type: String },
                title: { type: String },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
    itemsTwo: {
      type: [
        {
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
});

const categorySchema = new mongoose.Schema({
  isHidden: { type: Boolean, default: false },
  title: { type: String },
  products: { type: [individualProductSchema], default: [] },
});

const systemsSchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  bannerSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    imageAlt: { type: String },
    image: { type: String },
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
    description: { type: String },
    categories: { type: [categorySchema], default: [] },
  },
  thirdSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
});

export default mongoose.models.Systems ||
  mongoose.model("Systems", systemsSchema);
