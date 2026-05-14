import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import { bannerData, ctaBannerData, introData, industriesData } from "./data";
import DescImageIntro from "../common/DescImageIntro";
import IndustriesWeServe from "./sections/IndustriesWeServe";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <DescImageIntro data={introData} />
      <IndustriesWeServe data={industriesData} />
      <InnerCta data={ctaBannerData} maxW="max-w-[18ch]" />
    </>
  );
};

export default Index;
