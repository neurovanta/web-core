import CommonSlider from "../common/CommonSlider";
import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import SectionHeader from "../common/SectionHeader";
import {
  bannerData,
  sectionHeaderData,
  ctaBannerData,
  ourJourneyData,
} from "./data";
import OurJourney from "./sections/OurJourney";
import RotatingSlider from "./sections/RotatingSlider";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} maxWTitle="max-w-[51ch]" />
      <SectionHeader {...sectionHeaderData} maxWSubtitle="max-w-[43ch]" maxWDescription="max-w-[48ch]" />
      <OurJourney data={ourJourneyData} />
      <RotatingSlider />
      <InnerCta data={ctaBannerData} maxW="max-w-[18ch]" />
    </>
  );
};

export default Index;
