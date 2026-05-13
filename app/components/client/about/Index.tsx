import InnerBanner from "../common/InnerBanner";
import SectionHeader from "../common/SectionHeader";
import { bannerData, sectionHeaderData, whySetsUsApartData, ctaBannerData } from "./data";
import EndToEndApproach from "./sections/EndToEndApproach";
import InfiniteClients from "./sections/InfiniteClients";
import Purposes from "./sections/Purposes";
import WhySetsUsApart from "./sections/WhySetsUsApart";
import InnerCta from "../common/InnerCta";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <SectionHeader {...sectionHeaderData} maxWDescription="max-w-[949px]" />
      <Purposes />
      <WhySetsUsApart data={whySetsUsApartData} />
      <EndToEndApproach />
      <InfiniteClients />
      <InnerCta data={ctaBannerData} maxW="max-w-[19ch]" />
    </>
  );
};

export default Index;
