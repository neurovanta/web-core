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
  approachData,
  howItFitsData
} from "./data";
import HowItFits from "./sections/HowFits";
import TabsImage from "../common/TabsImage";
import FourCardSlider from "../common/FourCardSlider";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <SectionHeader {...sectionHeaderData} maxWDescription="max-w-[909px]" />
      <FourCardSlider data={whatWeProvideData} />
      <CommonSlider data={keyBenefitsData} />
      <HowItFits  {...howItFitsData}/>
      <TabsImage data={approachData} />
      <InnerCta data={ctaBannerData} maxW="max-w-[18ch]" />
    </>
  );
};

export default Index;
