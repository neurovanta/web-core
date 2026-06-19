export interface ContactType {
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
    office: {
      title: string;
      address: string;
      directionLabel: string;
      directionHref: string;
      mail: string;
      phone: string;
    };
  };
  secondSection: {
    isHidden: boolean;
    map: string;
  };
}