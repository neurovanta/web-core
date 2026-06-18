// ─── Shared ───────────────────────────────────────────────────────────────────

interface WithHidden {
  isHidden: boolean;
}

// ─── Individual Solution ───────────────────────────────────────────────────────

export interface IndividualSolution {
  _id: string;
  isHidden: boolean;
  slug: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    script: string;
  };
  bannerSection: WithHidden & {
    image: string;
    imageAlt: string;
    title: string;
  };
  firstSection: WithHidden & {
    title: string;
    subTitle: string;
    description: string;
  };
  secondSection: WithHidden & {
    title: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  thirdSection: WithHidden & {
    title: string;
    items: { title: string; icon: string; iconAlt: string }[];
  };
  fourthSection: WithHidden & {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  fifthSection: WithHidden & {
    title: string;
    description: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  sixthSection: WithHidden & {
    title: string;
    image: string;
    imageAlt: string;
  };
}

// ─── Main Solution Page ────────────────────────────────────────────────────────

export interface SolutionType {
  seo: {
    metaTitle: string;
    metaDescription: string;
    script: string;
  };
  bannerSection: WithHidden & {
    image: string;
    imageAlt: string;
    title: string;
  };
  firstSection: WithHidden & {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  solutions: IndividualSolution[];
  thirdSection: WithHidden & {
    title: string;
    description: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  fourthSection: WithHidden & {
    title: string;
    description: string;
    items: { image: string; imageAlt: string }[];
  };
  fifthSection: WithHidden & {
    title: string;
    image: string;
    imageAlt: string;
  };
}