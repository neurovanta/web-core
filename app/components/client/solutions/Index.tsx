import InnerBanner from "../common/InnerBanner";
import { bannerData, ctaBannerData, wellnessData } from "./data";
import InnerCta from "../common/InnerCta";
import Intro from "./sections/Intro";
import Services from "./sections/Services";
import WellnessRequirements from "./sections/WellnessRequirements";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <Intro />
      <Services />
      <WellnessRequirements data={wellnessData} />
      <InnerCta data={ctaBannerData} maxW="max-w-[22ch]" />
    </>
  );
};

export default Index;
