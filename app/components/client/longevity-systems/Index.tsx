import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import SectionHeader from "../common/SectionHeader";
import { bannerData, ctaBannerData, sectionHeaderData } from "./data";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <SectionHeader {...sectionHeaderData} maxWTitle="max-w-[12ch]" maxWSubtitle="max-w-[43ch]" maxWDescription="max-w-[48ch]" />
      <InnerCta data={ctaBannerData} maxW="max-w-[18ch]" />
    </>
  );
};

export default Index;
