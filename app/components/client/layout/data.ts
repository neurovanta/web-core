export interface FooterMenu {
  heading: string;
  items: { label: string; href: string }[];
}

export const footerMenus: FooterMenu[] = [
  {
    heading: "Solutions",
    items: [
      {
        label: "Bespoke Wellness & Longevity Solutions",
        href: "/solutions/bespoke-wellness",
      },
      { label: "Well Space Design", href: "/solutions/well-space-design" },
    ],
  },
  {
    heading: "Longevity Systems",
    items: [
      { label: "Recovery & Regeneration Systems", href: "/systems/recovery" },
      { label: "Oxygen & Cellular Enhancement", href: "/systems/oxygen" },
      { label: "Thermal Detoxification", href: "/systems/thermal" },
      { label: "Light & Photo Biomodulation", href: "/systems/light" },
      { label: "Neuro & Cognitive Optimization", href: "/systems/neuro" },
      {
        label: "Metabolic & Performance Optimization",
        href: "/systems/metabolic",
      },
      { label: "Diagnostics & Bio-Monitoring", href: "/systems/diagnostics" },
      { label: "Mind-Body Immersion Experiences", href: "/systems/mind-body" },
    ],
  },
  {
    heading: "Quick links",
    items: [
      { label: "About Neuro Vanta", href: "/about-us" },
      { label: "Careers", href: "/careers" },
      { label: "The Neuro Vanta Journey", href: "/experience" },
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

export type NavItem = {
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "About Us",
    href: "/about-us",
  },
  {
    label: "Solutions",
    href: "/solutions",
    subItems: [
      {
        label: "Bespoke Wellness & Longevity Solutions",
        href: "/solutions/bespoke-wellness",
      },
      { label: "Well Space Design", href: "/solutions/well-space-design" },
    ],
  },
  {
    label: "Longevity Systems",
    href: "/systems",
    subItems: [
      { label: "Recovery & Regeneration Systems", href: "/systems/recovery" },
      { label: "Oxygen & Cellular Enhancement", href: "/systems/oxygen" },
      { label: "Thermal Detoxification", href: "/systems/thermal" },
      { label: "Light & Photobiomodulation", href: "/systems/light" },
      { label: "Neuro & Cognitive Optimization", href: "/systems/neuro" },
      {
        label: "Metabolic & Performance Optimization",
        href: "/systems/metabolic",
      },
      { label: "Diagnostics & Bio-Monitoring", href: "/systems/diagnostics" },
      { label: "Mind–Body Immersion Experiences", href: "/systems/mindbody" },
    ],
  },
  {
    label: "Industries We Serve",
    href: "/industries",
    subItems: [
      { label: "Longevity Clinics", href: "/systems/longevity-clinics" },
      {
        label: "Wellness & Medical Resorts",
        href: "/systems/wellness-and-medical-resorts",
      },
      {
        label: "Premium Gyms & Sports Clubs",
        href: "/systems/premium-gyms-and-sports-clubs",
      },
      {
        label: "Luxury Hotels & Spas",
        href: "/systems/luxury-hotels-and-spas",
      },
      {
        label: "Corporate Wellness Spaces",
        href: "/systems/corporate-wellness-spaces",
      },
      {
        label: "Private Clients & Residences",
        href: "/systems/private-clients-and-residences",
      },
      {
        label: "Hospitals & Rehabilitation Centres",
        href: "/systems/hospitals-and-rehabilitation-centres",
      },
    ],
  },
  {
    label: "Experience",
    href: "/experience",
  },
  {
    label: "Careers",
    href: "/careers",
  },
];

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Youtube", href: "https://youtube.com" },
];

export const CONTACT_INFO = {
  email: "mail@360-wellness.com",
  phone: "+97143332175",
};
