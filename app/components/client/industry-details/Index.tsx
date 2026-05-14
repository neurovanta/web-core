import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import { bannerData, ctaBannerData, introData, keyOfferingsData, benefitsData } from "./data";
import DescImageIntro from "../common/DescImageIntro";
import FourCardSlider from "../common/FourCardSlider";
import CommonSlider from "../common/CommonSlider";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} maxWTitle="max-w-[62ch]" />
      <DescImageIntro data={introData} />
      <FourCardSlider data={keyOfferingsData} />
      <CommonSlider data={benefitsData} />
      <InnerCta data={ctaBannerData} maxW="max-w-[18ch]" />
    </>
  );
};

export default Index;
