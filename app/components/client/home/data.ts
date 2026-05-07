export const wellnessSliderData = {
  heading: "BESPOKE WELLNESS & LONGEVITY SOLUTIONS",
  description:
    "Personalized, science-led systems tailored to individual physiology, lifestyle, and performance goals.",
  buttons: [
    { label: "EXPLORE", href: "#" },
    { label: "VIEW PRODUCTS", href: "#" },
  ],
  slides: [
    {
      number: "01",
      title: "Personalized to Individual Biology",
      image: "/assets/images/home/second-section/1.jpg",
    },
    {
      number: "02",
      title: "Science-Led & Technology-Enabled",
      image: "/assets/images/home/second-section/2.jpg",
    },
    {
      number: "03",
      title: "Measurable, Outcome-Focused Results",
      image: "/assets/images/home/hero/hero-poster.jpg",
    },
    {
      number: "04",
      title: "Adaptive & Evolutive Systems",
      image: "/assets/images/home/second-section/3.jpg",
    },
  ],
};

export const wellnessSliderData2 = {
  heading: "Wellness Space Design",
  description:
    "End-to-end design and integration of intelligent wellness environments—where architecture, technology, and human biology work in harmony.",
  buttons: [
    { label: "EXPLORE", href: "#" },
    { label: "VIEW PRODUCTS", href: "#" },
  ],
  slides: [
    {
      number: "01",
      title: "Human-Centric Spatial Design",
      image: "/assets/images/home/second-section/3.jpg",
    },
    {
      number: "02",
      title: "Scalable & Future-Ready",
      image: "/assets/images/home/second-section/1.jpg",
    },
    {
      number: "03",
      title: "Evidence-Based Layoutsed Results",
      image: "/assets/images/home/second-section/2.jpg",
    },
    {
      number: "04",
      title: "Seamless Technology Integration",
      image: "/assets/images/home/hero/hero-poster.jpg",
    },
  ],
};

export type LongevitySlide = {
  image: string;
  title: string;
  href: string;
};

export type LongevityCategory = {
  label: string;
  slides: LongevitySlide[];
};

export type LongevitySystemsData = {
  heading: string;
  categories: LongevityCategory[];
};

export const longevitySystemsData: LongevitySystemsData = {
  heading: "LONGEVITY SYSTEMS",
  categories: [
    {
      label: "Recovery & Regeneration Therapies",
      slides: [
        { image: "/assets/images/home/longevity-section/1.jpg", title: "Infrared Saunas", href: "#" },
        { image: "/assets/images/home/longevity-section/2.jpg", title: "Finnish Saunas", href: "#" },
        { image: "/assets/images/home/longevity-section/3.jpg", title: "Salt Therapy Rooms (Halotherapy)", href: "#" },
        { image: "/assets/images/home/longevity-section/4.jpg", title: "Detox Chambers", href: "#" },
      ],
    },
    {
      label: "Oxygen & Cellular Enhancement",
      slides: [
        { image: "/assets/images/home/longevity-section/2.jpg", title: "Hyperbaric Oxygen Therapy", href: "#" },
        { image: "/assets/images/home/longevity-section/3.jpg", title: "EWOT Systems", href: "#" },
        { image: "/assets/images/home/longevity-section/4.jpg", title: "Ozone Therapy", href: "#" },
        { image: "/assets/images/home/longevity-section/1.jpg", title: "IV Drip Lounges", href: "#" },
      ],
    },
    {
      label: "Thermal Detoxification",
      slides: [
        { image: "/assets/images/home/longevity-section/3.jpg", title: "Infrared Saunas", href: "#" },
        { image: "/assets/images/home/longevity-section/4.jpg", title: "Finnish Saunas", href: "#" },
        { image: "/assets/images/home/longevity-section/1.jpg", title: "Salt Therapy Rooms (Halotherapy)", href: "#" },
        { image: "/assets/images/home/longevity-section/2.jpg", title: "Detox Wrap Studios", href: "#" },
      ],
    },
    {
      label: "Light & Photo biomodulation",
      slides: [
        { image: "/assets/images/home/longevity-section/4.jpg", title: "Red Light Therapy Pods", href: "#" },
        { image: "/assets/images/home/longevity-section/3.jpg", title: "Full-Body LLLT Panels", href: "#" },
        { image: "/assets/images/home/longevity-section/2.jpg", title: "Photobiomodulation Beds", href: "#" },
        { image: "/assets/images/home/longevity-section/1.jpg", title: "Intranasal Light Therapy", href: "#" },
      ],
    },
    {
      label: "Neuro & Cognitive Optimization",
      slides: [
        { image: "/assets/images/home/longevity-section/1.jpg", title: "Neurofeedback Systems", href: "#" },
        { image: "/assets/images/home/longevity-section/4.jpg", title: "Float / Sensory Deprivation Tanks", href: "#" },
        { image: "/assets/images/home/longevity-section/2.jpg", title: "tDCS Devices", href: "#" },
        { image: "/assets/images/home/longevity-section/3.jpg", title: "Brain Mapping Studios", href: "#" },
      ],
    },
    {
      label: "Metabolic & Performance Optimization",
      slides: [
        { image: "/assets/images/home/longevity-section/3.jpg", title: "VO2 Max Testing Labs", href: "#" },
        { image: "/assets/images/home/longevity-section/1.jpg", title: "Altitude Training Rooms", href: "#" },
        { image: "/assets/images/home/longevity-section/4.jpg", title: "Metabolic Assessment Suites", href: "#" },
        { image: "/assets/images/home/longevity-section/2.jpg", title: "Cold Plunge Pools", href: "#" },
      ],
    },
    {
      label: "Diagnostics & Bio-Monitoring",
      slides: [
        { image: "/assets/images/home/longevity-section/1.jpg", title: "Full-Body MRI Screening", href: "#" },
        { image: "/assets/images/home/longevity-section/4.jpg", title: "Continuous Glucose Monitoring", href: "#" },
        { image: "/assets/images/home/longevity-section/2.jpg", title: "DEXA Scan Suites", href: "#" },
        { image: "/assets/images/home/longevity-section/3.jpg", title: "Epigenetic Age Testing", href: "#" },
      ],
    },
    {
      label: "Mind-Body Immersion Experiences",
      slides: [
        { image: "/assets/images/home/longevity-section/2.jpg", title: "Meditation Caves", href: "#" },
        { image: "/assets/images/home/longevity-section/1.jpg", title: "Breathwork Studios", href: "#" },
        { image: "/assets/images/home/longevity-section/3.jpg", title: "Sound Healing Rooms", href: "#" },
        { image: "/assets/images/home/longevity-section/4.jpg", title: "Yoga & Movement Labs", href: "#" },
      ],
    },
  ],
};


export const heroStatsData = {
  title: "ADVANCED LONGEVITY. INTELLIGENT WELLNESS. DESIGNED FOR LIFE PERFORMANCE.",
  description:
    "Neuro Vanta delivers bespoke wellness and longevity solutions that merge neuroscience, bio-technology, and spatial design. We create high-performance environments and systems that optimize human health, recovery, cognition, and longevity—at both individual and institutional scales.",
  button: {
    label: "About Neuro Vanta",
    href: "/about",
  },
  stats: [
    {
      id: 0,
      number: "10+",
      label: "Global Brands",
      icon: "/assets/images/home/hero-stats/1.svg",
    },
    {
      id: 1,
      number: "20+",
      label: "Group Experience",
      icon: "/assets/images/home/hero-stats/1.svg",
    },
    {
      id: 2,
      number: "14+",
      label: "Global Brands",
      icon: "/assets/images/home/hero-stats/1.svg",
    },
  ],
};

export const whyNeuroVantaData = {
  heading: "WHY NEURO VANTA",
  slides: [
    {
      icon: "/assets/images/home/why-neuro/1.svg",
      title: "Science-Driven Longevity Systems",
      description: "Fully customized wellness and recovery ecosystems—integrating technology, design, and human performance.",
    },
    {
      icon: "/assets/images/home/why-neuro/2.svg",
      title: "Bespoke Wellness Environments",
      description: "Fully customized wellness and recovery ecosystems—integrating technology, design, and human performance.",
    },
    {
      icon: "/assets/images/home/why-neuro/3.svg",
      title: "End-to-End Expertise Across Industries",
      description: "Fully customized wellness and recovery ecosystems—integrating technology, design, and human performance.",
    },
    {
      icon: "/assets/images/home/why-neuro/4.svg",
      title: "Scalable Across Environments",
      description: "Fully customized wellness and recovery ecosystems—integrating technology, design, and human performance.",
    },
  ],
};


export const elevatingWellnessData = {
  heading: "ELEVATING WELLNESS ACROSS INDUSTRIES",

  items: [
    { id: 1, label: "Longevity Clinics", image: "/assets/images/home/elevating-wellness/1.svg" },
    { id: 2, label: "Wellness & Medical Resorts", image: "/assets/images/home/elevating-wellness/2.svg" },
    { id: 3, label: "Premium Gyms & Sports Clubs", image: "/assets/images/home/elevating-wellness/3.svg" },
    { id: 4, label: "Luxury Hotels & Spas", image: "/assets/images/home/elevating-wellness/4.svg" },
    { id: 5, label: "Corporate Wellness Spaces", image: "/assets/images/home/elevating-wellness/5.svg" },
    { id: 6, label: "Private Clients & Residences", image: "/assets/images/home/elevating-wellness/6.svg" },
    { id: 7, label: "Hospitals & Rehabilitation Centres", image: "/assets/images/home/elevating-wellness/7.svg" },
  ],
};


export const brandsData = {
  heading: "Aligned with world-class brands",
  rows: {
    row1: [
      {
        id: "acronis-1",
        logo: "/assets/images/home/clients/1.jpg",
      },
      {
        id: "logitech-1",
        logo: "/assets/images/home/clients/2.jpg",
      },
      {
        id: "aws-1",
        logo: "/assets/images/home/clients/3.jpg",
      },
    ],
    row2: [
      {
        id: "acronis-2",
        logo: "/assets/images/home/clients/1.jpg",
      },
      {
        id: "hp-1",
        logo: "/assets/images/home/clients/4.jpg",
      },
      {
        id: "aws-2",
        logo: "/assets/images/home/clients/3.jpg",
      },
    ],
row3: [
  {
    id: "aws-3",
    logo: "/assets/images/home/clients/3.jpg",
  },
  {
    id: "logitech-2",
    logo: "/assets/images/home/clients/2.jpg",
  },
  {
    id: "hp-2",
    logo: "/assets/images/home/clients/4.jpg",
  },
],
  },
};