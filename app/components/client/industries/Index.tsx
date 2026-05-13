import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import { bannerData, ctaBannerData, introData, industriesData } from "./data";
import Intro from "./sections/Intro";
import IndustriesWeServe from "./sections/IndustriesWeServe";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <Intro data={introData} />
      <IndustriesWeServe data={industriesData} />
      <InnerCta data={ctaBannerData} maxW="max-w-[18ch]" />
    </>
  );
};

export default Index;
