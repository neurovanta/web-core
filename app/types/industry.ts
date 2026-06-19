export interface IndividualIndustry {
  _id: string;
  isHidden: boolean;
  slug: string;
  thumbnailImage: string;
  thumbnailImageAlt: string;
  thumbnailTitle: string;
  thumbnailDescription: string;
  homeAnimatedIcon: string;
  homeAnimatedIconAlt: string;
  homeAnimatedMobIcon: string;
  homeAnimatedMobIconAlt: string;
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
    items: {
      _id: string;
      title: string;
      image: string;
      imageAlt: string;
    }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    items: {
      _id: string;
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
    image: string;
    imageAlt: string;
  };
}

export interface Industries {
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
  };
  industries: IndividualIndustry[];
  thirdSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}
