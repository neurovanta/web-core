export const bannerData = {
  title: "Our Solutions",
  image: "/assets/images/solutions/banner.jpg",
};

export const ctaBannerData = {
  bgImage: "/assets/images/solutions/cta.jpg",
  title: "Explore the Right Solution for Your Space",
  btn: {
    label: "CONTACT US",
    href: "/contact-us",
  },
};

export interface IntroData {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const introData: IntroData = {
  title: "INTEGRATED SOLUTIONS BUILT FOR YOUR SPACE",
  description:
    "We ensure every solution is optimized for \n performance, usability, and \n long-term value.",
  image: "/assets/images/solutions/intro.jpg",
  imageAlt: "Integrated Solutions",
};

export const serviceCardsData = [
  {
    title: "BESPOKE WELLNESS & LONGEVITY SOLUTIONS",
    description:
      "Personalized, science-led systems tailored to individual physiology, lifestyle, and performance goals.",
    bgImage: "/assets/images/solutions/services/1.jpg",
    buttons: [
      { label: "EXPLORE", href: "/solutions/wellness" },
      { label: "VIEW PRODUCTS", href: "/systems/wellness" },
    ],
  },
  {
    title: "WELLNESS SPACE DESIGN",
    description:
      "End-to-end design and integration of intelligent wellness environments—where architecture, technology, and human biology work in harmony.",
    bgImage: "/assets/images/solutions/services/2.jpg",
    buttons: [
      { label: "EXPLORE", href: "/solutions/design" },
      { label: "VIEW PRODUCTS", href: "/systems/design" },
    ],
  },
];



export interface WellnessSlide {
  number: string;
  title: string;
  image: string;
}

export interface WellnessData {
  heading: string;
  description: string;
  button: {
    label: string;
    href: string;
  };
  slides: WellnessSlide[];
}

export const wellnessData: WellnessData = {
  heading: "NOT EVERY REQUIREMENT FITS INTO A PREDEFINED SOLUTION",
  description:
    "We specialize in developing fully customized wellness environments based on your specific goals, space, and user needs.",
  button: {
    label: "CONTACT US",
    href: "/contact",
  },
  slides: [
    {
      number: "01",
      title: "Personalized Wellness Concepts",
      image: "/assets/images/home/second-section/1.jpg",
    },
    {
      number: "02",
      title: "Unique Combinations of Technologies",
      image: "/assets/images/solutions/wellness/1.jpg",
    },
    {
      number: "03",
      title: "Space-Specific Design Solutions",
      image: "/assets/images/home/hero/hero-poster.jpg",
    },
    {
      number: "04",
      title: "Brand-Aligned User Experiences",
      image: "/assets/images/home/second-section/3.jpg",
    },
  ],
};
