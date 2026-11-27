import { isShown } from "@/app/components/client/common/isShown";
import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import SectionHeader from "../common/SectionHeader";
import OurJourney from "./sections/OurJourney";
import RotatingSlider from "./sections/RotatingSlider";
import { ExperienceType } from "@/app/types/experience";

const Index = ({ data }: { data: ExperienceType }) => {
  return (
    <>
      {isShown(data.bannerSection) && (
        <InnerBanner data={data.bannerSection} maxWTitle="max-w-[51ch]" />
      )}
      {isShown(data.firstSection) && (
        <SectionHeader
          data={data.firstSection}
          maxWSubtitle="max-w-[43ch]"
          maxWDescription="max-w-[48ch]"
        />
      )}
      {isShown(data.secondSection) && <OurJourney data={data.secondSection} />}
      {isShown(data.thirdSection) && (
        <RotatingSlider data={data.thirdSection} />
      )}
      {isShown(data.fourthSection) && (
        <InnerCta
          data={{
            bgImage: data.fourthSection.image,
            title: data.fourthSection.title,
          }}
          maxW="max-w-[18ch]"
        />
      )}
    </>
  );
};

export default Index;
