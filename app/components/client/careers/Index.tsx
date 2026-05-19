import CurveSlider from "../common/CurveSlider";
import InnerBanner from "../common/InnerBanner";
import { bannerData, careerCulture, careerIntro } from "./data";
import CareerIntro from "./sections/CareerIntro";
import OpenPositions from "./sections/OpenPositions";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} />
      <CareerIntro {...careerIntro} />
      <OpenPositions />
      <CurveSlider {...careerCulture} />
    </>
  );
};

export default Index;
