export interface IndividualProduct {
  _id: string;
  isHidden: boolean;
  slug: string;
  categoryId: string;
  thumbnailImage: string;
  thumbnailImageAlt: string;
  thumbnailTitle: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    script: string;
  };
  bannerSection: {
    isHidden: boolean;
    title: string;
    imageAlt: string;
    image: string;
  };
  firstSection: {
    isHidden: boolean;
    title: string;
    subTitle: string;
    description: string;
  };
  secondSection: {
    isHidden: boolean;
    items: {
      _id: string;
      title: string;
      description: string;
      image: string;
      imageAlt: string;
    }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    items: {
      _id: string;
      category: string;
      title: string;
      description: string;
      items: {
        _id: string;
        icon: string;
        iconAlt: string;
        title: string;
      }[];
    }[];
    itemsTwo: {
      _id: string;
      image: string;
      imageAlt: string;
    }[];
  };
  fourthSection: {
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

export interface SystemsCategory {
  _id: string;
  isHidden: boolean;
  title: string;
  products: IndividualProduct[];
}

export interface Systems {
  _id: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    script: string;
  };
  bannerSection: {
    isHidden: boolean;
    title: string;
    imageAlt: string;
    image: string;
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
    description: string;
    categories: SystemsCategory[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    image: string;
    imageAlt: string;
  };
}
