export interface IndividualSolutionType {
  _id: string;
  isHidden: boolean;
  slug: string;
  thumbnailImage: string;
  thumbnailImageAlt: string;
  thumbnailTitle: string;
  thumbnailDescription: string;
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
    subTitle: string;
    description: string;
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    items: {
      title: string;
      image: string;
      imageAlt: string;
    }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    items: {
      title: string;
      icon: string;
      iconAlt: string;
    }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: {
      title: string;
      image: string;
      imageAlt: string;
    }[];
  };
  sixthSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}

export interface SolutionType {
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
  solutions: IndividualSolutionType[];
  thirdSection: {
    isHidden: boolean;
    title: string;
    description: string;
    button: { label: string; href: string };
    items: {
      title: string;
      image: string;
      imageAlt: string;
    }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    items: {
      image: string;
      imageAlt: string;
    }[];
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}
