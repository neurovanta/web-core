import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import Intro from "./sections/Intro";
import Services from "./sections/Services";
import WellnessRequirements from "./sections/WellnessRequirements";
import MoreThanSolutions from "./sections/SolutionsAnimated";
import { SolutionType } from "@/app/types/solution";

const Index = ({ data }: { data: SolutionType }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} />
      <Intro data={data.firstSection} />
      <Services data={data.solutions} />
      <WellnessRequirements data={data.thirdSection} />
      <MoreThanSolutions data={data.fourthSection} />
      <InnerCta
        data={{
          bgImage: data.fifthSection.image,
          title: data.fifthSection.title,
        }}
        maxW="max-w-[22ch]"
      />
    </>
  );
};

export default Index;
