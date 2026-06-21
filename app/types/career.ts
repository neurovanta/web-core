export interface CareerJob {
  _id: string;
  isHidden: boolean;
  label: string;
  designation: string;
  type: string;
  location: string;
}

export interface Careers {
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
    description: string;
    image: string;
    imageAlt: string;
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    contactLabel: string;
    contactEmail: string;
    jobs: CareerJob[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: {
      _id: string;
      image: string;
      imageAlt: string;
    }[];
  };
}