export const bannerData = {
  title: "Red Light Therapy Panels ",
  image: "/assets/images/system-details/banner.jpg",
};

export const sectionHeaderData = {
  title: "Precision light therapy for elevated wellness",
  subtitle:
    "Red Light Therapy Panels use advanced wavelengths of red and near-infrared light to stimulate cellular function, promote faster recovery, and support overall vitality.",
  description:
    "Designed for both performance and wellness environments, these panels help reduce inflammation, improve skin health, and enhance muscle recovery. Engineered with precision and efficiency, they deliver consistent, targeted therapy to optimize your body’s natural healing processes.",
};

export const highlightSlides = [
  {
    title: "MULTI-THERAPY\nINTEGRATION",
    description: "Combines salt, red light, oxygen, frequencies, and aroma",
    bgImage: "/assets/images/system-details/highlight/1.jpg",
  },
  {
    title: "Deep\nRelaxation",
    description:
      "HALOCAB uses an advanced light spectrum with individually controllable wavelengths",
    bgImage: "/assets/images/system-details/highlight/2.jpg",
  },
  {
    title: "Breathe deeply.\nFeel new energy.",
    description:
      "The HALOCAB salt application gently releases fine salt particles into the air you breathe.",
    bgImage: "/assets/images/system-details/highlight/3.jpg",
  },
];

export type DiscoverHighlight = {
  icon: string; // path to SVG icon
  title: string;
};

export type DiscoverTab = {
  label: string;
  title: string;
  description: string;
  highlights: DiscoverHighlight[];
};

export type DiscoverRightSlide = {
  image: string;
};

export type DiscoverData = {
  heading: string;
  tabs: DiscoverTab[];
};

export type DiscoverGalleryData = {
  slides: DiscoverRightSlide[];
};

// ── Left side data ────────────────────────────────────────────────────────────
export const discoverData: DiscoverData = {
  heading: "DISCOVER EVERY DETAIL",
  tabs: [
    {
      label: "Salt",
      title: "The Benefits of Salt Inhalation",
      description:
        "Discover how micro salt particles make breathing easier, support skin regeneration, enhance wellbeing and gently support the body.",
      highlights: [
        {
          icon: "/assets/images/system-details/discovery/1.svg",
          title: "Smell & Brain",
        },
        {
          icon: "/assets/images/system-details/discovery/2.svg",
          title: "Stress & Nervous System",
        },
        {
          icon: "/assets/images/system-details/discovery/3.svg",
          title: "Dosing & Safety",
        },
        {
          icon: "/assets/images/system-details/discovery/4.svg",
          title: "Focus & Cognitive Regulation",
        },
        {
          icon: "/assets/images/system-details/discovery/5.svg",
          title: "Science & System Integration",
        },
      ],
    },
    {
      label: "Ionized Oxygen",
      title: "The Power of Ionized Oxygen",
      description:
        "Ionized oxygen molecules energize cells, sharpen mental clarity, and accelerate recovery through precision-delivered therapy.",
      highlights: [
        {
          icon: "/assets/images/system-details/discovery/1.svg",
          title: "Cellular Energy Production",
        },
        {
          icon: "/assets/images/system-details/discovery/2.svg",
          title: "Mental Clarity",
        },
        {
          icon: "/assets/images/system-details/discovery/3.svg",
          title: "Accelerated Recovery",
        },
        {
          icon: "/assets/images/system-details/discovery/4.svg",
          title: "Blood Circulation",
        },
        {
          icon: "/assets/images/system-details/discovery/5.svg",
          title: "Immune Support & Detoxification",
        },
      ],
    },
    {
      label: "Frequencies",
      title: "Resonance & Frequency Therapy",
      description:
        "Targeted sound frequencies promote deep cellular healing, reduce inflammation, and align the body's natural biorhythms.",
      highlights: [
        {
          icon: "/assets/images/system-details/discovery/1.svg",
          title: "Cellular Healing Process",
        },
        {
          icon: "/assets/images/system-details/discovery/2.svg",
          title: "Inflammation Reduction",
        },
        {
          icon: "/assets/images/system-details/discovery/3.svg",
          title: "Biorhythm Alignment",
        },
        {
          icon: "/assets/images/system-details/discovery/4.svg",
          title: "Nervous System Calm",
        },
        {
          icon: "/assets/images/system-details/discovery/5.svg",
          title: "Focus Enhancement",
        },
      ],
    },
    {
      label: "Aroma",
      title: "Aromatherapy Integration",
      description:
        "Precision-diffused botanical aromas engage the limbic system, triggering emotional balance, stress relief, and deep restoration.",
      highlights: [
        {
          icon: "/assets/images/system-details/discovery/1.svg",
          title: "Limbic Activation & Emotional Balance",
        },
        {
          icon: "/assets/images/system-details/discovery/2.svg",
          title: "Stress Relief",
        },
        {
          icon: "/assets/images/system-details/discovery/3.svg",
          title: "Emotional Balance",
        },
        {
          icon: "/assets/images/system-details/discovery/4.svg",
          title: "Deep Restoration",
        },
        {
          icon: "/assets/images/system-details/discovery/5.svg",
          title: "Mood Uplift & Mental Clarity",
        },
      ],
    },
  ],
};

export const discoverGalleryData: DiscoverGalleryData = {
  slides: [
    { image: "/assets/images/system-details/discovery/slider/1.jpg" },
    { image: "/assets/images/system-details/highlight/1.jpg" },
    { image: "/assets/images/system-details/highlight/3.jpg" },
  ],
};

export const longevityInnovationData = {
  title: "LONGEVITY INNOVATION",
  description: "Discover everything about our other longevity devices.",
  images: [
    "/assets/images/system-details/innovation/1.jpg",
    "/assets/images/system-details/innovation/2.jpg",
    "/assets/images/system-details/innovation/3.jpg",
    "/assets/images/system-details/innovation/4.jpg",
    "/assets/images/system-details/innovation/5.jpg",
  ],
};
