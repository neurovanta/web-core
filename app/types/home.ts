export interface HomeType {
  _id: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    script: string;
  };
  firstSection: {
    isHidden: boolean;
    video: string;
    videoAlt: string;
    posterImage: string;
    title: string;
    buttons: { label: string; href: string }[];
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    description: string;
    slug: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    description: string;
    slug: string;
    items: { title: string; image: string; imageAlt: string }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    description?: string;
    categories: string[];
    products: string[];
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    button: { label: string; href: string };
    items: { title: string; value: string; icon: string; iconAlt: string }[];
  };
  sixthSection: {
    isHidden: boolean;
    title: string;
    items: { title: string; description: string; icon: string; iconAlt: string }[];
  };
  seventhSection: {
    isHidden: boolean;
    title: string;
    items: {
      homeAnimatedIcon: string;
      homeAnimatedIconAlt: string;
      slug: string;
      thumbnailTitle: string;
    }[];
  };
  eighthSection: {
    isHidden: boolean;
    title: string;
    row1: { image: string; imageAlt: string; _id: string }[];
    row2: { image: string; imageAlt: string; _id: string }[];
    row3: { image: string; imageAlt: string; _id: string }[];
  };
  ninthSection: {
    isHidden: boolean;
    title: string;
    subtitle: string;
  };
}

export interface HomePageData {
  home: HomeType;
  categories: {
    _id: string;
    title: string;
    products: { _id: string; thumbnailTitle: string; slug: string, thumbnailImage: string, thumbnailImageAlt: string }[];
  }[];
  industries: {
    _id: string;
    homeAnimatedIcon: string;
    homeAnimatedIconAlt: string;
    thumbnailTitle: string;
    homeAnimatedMobIcon: string;
    homeAnimatedMobIconAlt: string;
    slug: string;
  }[];
}