import CurveSlider from "../common/CurveSlider";
import InnerBanner from "../common/InnerBanner";
import CareerIntro from "./sections/CareerIntro";
import NoOpenings from "./sections/NoOpenings";
import OpenPositions from "./sections/OpenPositions";
import { Careers } from "@/app/types/career";

const Index = ({ data }: { data: Careers }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} />
      <CareerIntro data={data.firstSection} />
      {(data.secondSection?.jobs?.filter((job) => !job.isHidden).length ?? 0) >
      0 ? (
        <OpenPositions
          data={{
            ...data.secondSection,
            jobs: data.secondSection.jobs.filter((job) => !job.isHidden),
          }}
        />
      ) : (
        <NoOpenings />
      )}
      <CurveSlider data={data.thirdSection} button={true} />
    </>
  );
};

export default Index;
