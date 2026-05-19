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



export type NavItem = {
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Solutions",
    href: "/solutions",
    subItems: [
      { label: "Recovery & Regeneration Systems", href: "/solutions/recovery" },
      { label: "Oxygen & Cellular Enhancement", href: "/solutions/oxygen" },
      { label: "Thermal Detoxification", href: "/solutions/thermal" },
      { label: "Light & Photobiomodulation", href: "/solutions/light" },
      { label: "Neuro & Cognitive Optimization", href: "/solutions/neuro" },
      { label: "Metabolic & Performance Optimization", href: "/solutions/metabolic" },
      { label: "Diagnostics & Bio-Monitoring", href: "/solutions/diagnostics" },
      { label: "Mind–Body Immersion Experiences", href: "/solutions/mindbody" },
    ],
  },
  {
    label: "Longevity Systems",
    href: "/longevity",
    subItems: [
      { label: "Recovery & Regeneration Systems", href: "/longevity/recovery" },
      { label: "Oxygen & Cellular Enhancement", href: "/longevity/oxygen" },
      { label: "Thermal Detoxification", href: "/longevity/thermal" },
      { label: "Light & Photobiomodulation", href: "/longevity/light" },
      { label: "Neuro & Cognitive Optimization", href: "/longevity/neuro" },
      { label: "Metabolic & Performance Optimization", href: "/longevity/metabolic" },
      { label: "Diagnostics & Bio-Monitoring", href: "/longevity/diagnostics" },
      { label: "Mind–Body Immersion Experiences", href: "/longevity/mindbody" },
    ],
  },
  {
    label: "Industries We Serve",
    href: "/industries",
    subItems: [
      { label: "Professional Sports", href: "/industries/sports" },
      { label: "Corporate Wellness", href: "/industries/corporate" },
      { label: "Hospitality & Spas", href: "/industries/hospitality" },
      { label: "Medical & Clinical", href: "/industries/medical" },
      { label: "Military & Defense", href: "/industries/military" },
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