export interface ExperienceType {
  _id: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    script: string;
  };
  bannerSection: {
    isHidden: boolean;
    image: string;
    imageAlt: string;
    title: string;
  };
  firstSection: {
    isHidden: boolean;
    title: string;
    subtitle: string;
    description: string;
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}