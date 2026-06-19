export interface AboutType {
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
    items: {
      title: string;
      description: string;
      icon: string;
      iconAlt: string;
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
    items: {
      title: string;
      image: string;
      imageAlt: string;
    }[];
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    items: {
      _id: string;
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

export interface AboutPageData {
  about: AboutType;
}
