export const bannerData = {
  title: "The Neuro Vanta Experience",
  image: "/assets/images/experience/banner.jpg",
};

export const sectionHeaderData = {
  title: "Neuro Vanta Smart Spaces for Better Living",
  subtitle:
    "The Neuro Vanta Experience is a comprehensive journey that blends science, design, and innovation to create highly personalized wellness environments..",
  description:
    "From understanding your vision to delivering fully functional spaces, every step is tailored to your unique needs",
};

export const ctaBannerData = {
  bgImage: "/assets/images/experience/cta.jpg",
  title: "Experience the Future of Wellness",
  btn: {
    label: "CONTACT US",
    href: "/contact-us",
  },
};


export const ourJourneyData = {
  title: "OUR JOURNEY",
  subtitle:
    "Neuro Vanta was founded with a vision to redefine how wellness is experienced across industries. What began as a focus on advanced wellness technologies has evolved into a complete ecosystem approach — integrating design, innovation, and performance \n driven solutions.",
  description:
    "Over time, we have expanded our capabilities to deliver not just products, but fully immersive environments that support recovery, longevity, and human optimization.",
  image: "/assets/images/experience/journey.jpg",
};



export interface Slide {
  id: number;
  title: string;
  description: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: "Discovery & Consultation",
    description:
      "We begin by understanding your goals, audience, and vision. This helps us define the right wellness direction for your space.",
  },
  {
    id: 2,
    title: "Research & Strategy",
    description:
      "Deep-diving into market insights, user behaviors, and competitive landscapes to craft a strategy uniquely tailored to your needs.",
  },
  {
    id: 3,
    title: "Concept Development",
    description:
      "Our team ideates and shapes concepts that align with your brand identity, turning abstract ideas into tangible directions.",
  },
  {
    id: 4,
    title: "Design & Prototyping",
    description:
      "From wireframes to high-fidelity prototypes, every detail is crafted with precision to bring your vision to life visually.",
  },
  {
    id: 5,
    title: "Testing & Refinement",
    description:
      "We validate designs with real users and stakeholders, iterating rapidly to ensure every interaction feels intuitive and seamless.",
  },
  {
    id: 6,
    title: "Implementation & Launch",
    description:
      "Seamless handoff to development with pixel-perfect specs, followed by a carefully orchestrated launch strategy for maximum impact.",
  },
  {
    id: 7,
    title: "Growth & Optimization",
    description:
      "Post-launch, we monitor performance metrics and continuously optimize the experience to drive sustained engagement and growth.",
  },
];