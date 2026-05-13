import InnerBanner from "../common/InnerBanner";
import SectionHeader from "../common/SectionHeader";
import { bannerData, sectionHeaderData, whySetsUsApartData, ctaBannerData, approachData } from "./data";
import InfiniteClients from "./sections/InfiniteClients";
import Purposes from "./sections/Purposes";
import InnerCta from "../common/InnerCta";
import CommonSlider from "../common/CommonSlider";
import TabsImage from "../common/TabsImage";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <SectionHeader {...sectionHeaderData} maxWDescription="max-w-[949px]" />
      <Purposes />
      <CommonSlider data={whySetsUsApartData} />
      <TabsImage data={approachData} />
      <InfiniteClients />
      <InnerCta data={ctaBannerData} maxW="max-w-[19ch]" />
    </>
  );
};

export default Index;
