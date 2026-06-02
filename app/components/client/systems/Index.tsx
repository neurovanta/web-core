import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import SectionHeader from "../common/SectionHeader";
import TabsWithSlider from "../common/TabsWithSlider";
import { bannerData, ctaBannerData, ourProductsData, sectionHeaderData } from "./data";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <SectionHeader {...sectionHeaderData} maxWTitle="sm:max-w-[12ch]" maxWSubtitle="max-w-[43ch]" maxWDescription="max-w-[75ch]" />
      <TabsWithSlider data={ourProductsData} className="bg-cream-bg py-[60px] lg:py-120" />
      <InnerCta data={ctaBannerData} maxW="max-w-[18ch]" />
    </>
  );
};

export default Index;
