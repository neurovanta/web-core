export const bannerData = {
  title: "Redefining Wellness \n Through Science, Design & Innovation",
  image: "/assets/images/about/banner.jpg",
};

export const sectionHeaderData = {
  title: "Who We Are",
  subtitle:
    "Neuro Vanta is a wellness innovation company specializing in the creation of advanced environments for recovery, longevity, and human optimization.",
  description:
    "We combine cutting-edge technologies with intelligent spatial design to deliver high-performance wellness ecosystems.Each solution is thoughtfully designed to adapt to individual needs, ensuring a personalized and immersive experience. From concept to execution, we focus on precision, functionality, and long-term value, creating spaces that are both transformative and sustainable.",
};

export const purposesData = [
  {
    image: "/assets/images/about/purposes/1.svg",
    title: "Our Mission",
    description:
      "To redefine global wellness by creating environments that extend human potential and longevity.",
  },
  {
    image: "/assets/images/about/purposes/2.svg",
    title: "Our Vision",
    description:
      "To deliver integrated, science-driven wellness solutions that enhance physical, mental, and cellular performance.",
  },
  {
    image: "/assets/images/about/purposes/3.svg",
    title: "Our Value",
    description:
      "Our values define who we are and guide everything we do. We are committed to innovation, quality, and integrity.",
  },
];

export const whySetsUsApartData = {
  heading: "WHY SETS US APART",
  slides: [
    {
      icon: "/assets/images/about/what-sets/1.svg",
      title: "End-to-End Solution Delivery",
    },
    {
      icon: "/assets/images/about/what-sets/2.svg",
      title: "Design-Led Approach",
    },
    {
      icon: "/assets/images/about/what-sets/3.svg",
      title: "Science-Backed Technologies",
    },
    {
      icon: "/assets/images/about/what-sets/4.svg",
      title: "Custom-Built Solutions",
    },
    {
      icon: "/assets/images/about/what-sets/1.svg",
      title: "End-to-End Solution Delivery",
    },
    {
      icon: "/assets/images/about/what-sets/2.svg",
      title: "Design-Led Approach",
    },
  ],
};


export const approachData = {
  title: "OUR END-TO-END APPROACH",
  subtitle: "We provide complete turnkey solutions:",
  tabs: [
    {
      title: "Consultation & Site Assessment",
      image: "/assets/images/about/approach/1.jpg",
    },
    {
      title: "Space Planning & Design",
      image: "/assets/images/about/approach/2.jpg",
    },
    {
      title: "Technology Selection",
      image: "/assets/images/about/approach/3.jpg",
    },
    {
      title: "Supply & Installation",
      image: "/assets/images/about/approach/4.jpg",
    },
    {
      title: "Testing & Optimization",
      image: "/assets/images/about/approach/5.jpg",
    },
    { title: "Ongoing Support", image: "/assets/images/about/approach/6.jpg" },
  ],
};

export interface Brand {
  id: string;
  logo: string;
}

export interface BrandsData {
  title: string;
  brands: Brand[];
}

export const brandsData: BrandsData = {
  title: "ALIGNED WITH WORLD-CLASS BRANDS",
  brands: [
    {
      id: "acronis-1",
      logo: "/assets/images/home/clients/1.jpg",
    },
    {
      id: "logitech-1",
      logo: "/assets/images/home/clients/2.jpg",
    },
    {
      id: "acronis-2",
      logo: "/assets/images/home/clients/1.jpg",
    },
    {
      id: "hp-1",
      logo: "/assets/images/home/clients/4.jpg",
    },
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
};

export const ctaBannerData = {
  bgImage: "/assets/images/about/cta.jpg",
  title: "START YOUR JOURNEY WITH NEURO VANTA",
  btn: {
    label: "CONTACT US",
    href: "/contact-us",
  },
};
