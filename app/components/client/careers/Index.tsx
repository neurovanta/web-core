import CurveSlider from "../common/CurveSlider";
import InnerBanner from "../common/InnerBanner";
import { bannerData, careerCulture, careerIntro } from "./data";
import CareerIntro from "./sections/CareerIntro";
import OpenPositions from "./sections/OpenPositions";
import { Careers } from "@/app/types/career";

const Index = ({ data }: { data: Careers }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} />
      <CareerIntro data={data.firstSection} />
      <OpenPositions data={data.secondSection} />
      <CurveSlider data={data.thirdSection} button={true} />
    </>
  );
};

export default Index;
