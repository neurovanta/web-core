import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import SectionHeader from "../common/SectionHeader";
import OurJourney from "./sections/OurJourney";
import RotatingSlider from "./sections/RotatingSlider";
import { ExperienceType } from "@/app/types/experience";

const Index = ({ data }: { data: ExperienceType }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} maxWTitle="max-w-[51ch]" />
      <SectionHeader
        data={data.firstSection}
        maxWSubtitle="max-w-[43ch]"
        maxWDescription="max-w-[48ch]"
      />
      <OurJourney data={data.secondSection} />
      <RotatingSlider data={data.thirdSection} />
      <InnerCta
        data={{
          bgImage: data.fourthSection.image,
          title: data.fourthSection.title,
        }}
        maxW="max-w-[18ch]"
      />
    </>
  );
};

export default Index;
