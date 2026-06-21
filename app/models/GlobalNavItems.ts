import mongoose from "mongoose";

const globalNavItemsSchema = new mongoose.Schema({
  contact: {
    email: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  socials: {
    type: [
      {
        label: { type: String },
        type: { type: String },
        link: { type: String },
        isHidden: { type: Boolean, default: false },
      },
    ],
    default: [],
  },
  header: {
    solutionsLabel: { type: String, default: "Solutions" },
    systemsLabel: { type: String, default: "Longevity Systems" },
    industriesLabel: { type: String, default: "Industries We Serve" },
    menuItems: {
      type: [
        {
          kind: { type: String, enum: ["link", "group"], required: true },
          label: { type: String },
          link: { type: String },
          groupKey: {
            type: String,
            enum: ["solutions", "systems", "industries"],
          },
          isHidden: { type: Boolean, default: false },
        },
      ],
      default: [
        { kind: "group", groupKey: "solutions", isHidden: false },
        { kind: "group", groupKey: "systems", isHidden: false },
        { kind: "group", groupKey: "industries", isHidden: false },
      ],
    },
    solutionOverrides: {
      type: [
        {
          solutionId: { type: mongoose.Schema.Types.ObjectId },
          isHidden: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    systemOverrides: {
      type: [
        {
          categoryId: { type: mongoose.Schema.Types.ObjectId },
          isHidden: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    industryOverrides: {
      type: [
        {
          industryId: { type: mongoose.Schema.Types.ObjectId },
          isHidden: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  footer: {
    solutionsLabel: { type: String, default: "Solutions" },
    systemsLabel: { type: String, default: "Longevity Systems" },
    quickLinks: {
      type: [
        {
          label: { type: String },
          link: { type: String },
          isHidden: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    solutionOverrides: {
      type: [
        {
          solutionId: { type: mongoose.Schema.Types.ObjectId },
          isHidden: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    systemOverrides: {
      type: [
        {
          categoryId: { type: mongoose.Schema.Types.ObjectId },
          isHidden: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
});

export default mongoose.models.GlobalNavItems ||
  mongoose.model("GlobalNavItems", globalNavItemsSchema);
