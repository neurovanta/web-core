export interface FooterMenu {
  heading: string;
  items: { label: string; href: string }[];
}

export const footerMenus: FooterMenu[] = [
  {
    heading: "Solutions",
    items: [
      { label: "Bespoke Wellness & Longevity Solutions", href: "/" },
      { label: "Well Space Design", href: "/" },
    ],
  },
  {
    heading: "Longevity Systems",
    items: [
      { label: "Recovery & Regeneration Systems", href: "/" },
      { label: "Oxygen & Cellular Enhancement", href: "/" },
      { label: "Thermal Detoxification", href: "/" },
      { label: "Light & Photo Biomodulation", href: "/" },
      { label: "Neuro & Cognitive Optimization", href: "/" },
      { label: "Metabolic & Performance Optimization", href: "/" },
      { label: "Diagnostics & Bio-Monitoring", href: "/" },
      { label: "Mind-Body Immersion Experiences", href: "/" },
    ],
  },
  {
    heading: "Quick links",
    items: [
      { label: "About Neuro Vanta", href: "/" },
      { label: "Careers", href: "/" },
      { label: "The Neuro Vanta Journey", href: "/" },
    ],
  },
];

export const socialLinks = [
  { label: "Facebook", href: "/", type: "facebook" },
  { label: "Instagram", href: "/", type: "instagram" },
  { label: "LinkedIn", href: "/", type: "linkedin" },
  { label: "Youtube", href: "/", type: "youtube" },
] as const;

export type SocialType = (typeof socialLinks)[number]["type"];