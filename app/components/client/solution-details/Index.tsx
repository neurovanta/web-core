import CommonSlider from "../common/CommonSlider";
import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import SectionHeader from "../common/SectionHeader";
import {
  bannerData,
  sectionHeaderData,
  ctaBannerData,
  whatWeProvideData,
  keyBenefitsData,
  approachData
} from "./data";
import WhatWeProvideSlider from "./sections/WhatWeProvideSlider";
import HowItFits from "./sections/HowFits";
import TabsImage from "../common/TabsImage";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <SectionHeader {...sectionHeaderData} maxWDescription="max-w-[909px]" />
      <WhatWeProvideSlider data={whatWeProvideData} />
      <CommonSlider data={keyBenefitsData} />
      <HowItFits />
      <TabsImage data={approachData} />
      <InnerCta data={ctaBannerData} maxW="max-w-[18ch]" />
    </>
  );
};

export default Index;
