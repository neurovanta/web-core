import { isShown } from "@/app/components/client/common/isShown";
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
      {isShown(data.bannerSection) && <InnerBanner data={data.bannerSection} />}
      {isShown(data.firstSection) && <Intro data={data.firstSection} />}
      <Services data={data.solutions} />
      {isShown(data.thirdSection) && (
        <WellnessRequirements data={data.thirdSection} />
      )}
      {isShown(data.fourthSection) && (
        <MoreThanSolutions data={data.fourthSection} />
      )}
      {isShown(data.fifthSection) && (
        <InnerCta
          data={{
            bgImage: data.fifthSection.image,
            title: data.fifthSection.title,
          }}
          maxW="max-w-[22ch]"
        />
      )}
    </>
  );
};

export default Index;
