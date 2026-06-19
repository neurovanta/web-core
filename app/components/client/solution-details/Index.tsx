import CommonSlider from "../common/CommonSlider";
import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import SectionHeader from "../common/SectionHeader";
import HowItFits from "./sections/HowFits";
import TabsImage from "../common/TabsImage";
import FourCardSlider from "../common/FourCardSlider";
import { IndividualSolutionType } from "@/app/types/solution";

const Index = ({ data }: { data: IndividualSolutionType }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} />
      <SectionHeader
        data={data.firstSection}
        maxWSubtitle="max-w-[45ch]"
        maxWDescription="max-w-[909px]"
      />
      <FourCardSlider data={data.secondSection} />
      <CommonSlider
        data={{
          heading: data.thirdSection.title,
          slides: data.thirdSection.items.map((item) => ({
            icon: item.icon,
            title: item.title,
          })),
        }}
      />
      <HowItFits data={data.fourthSection} />
      <TabsImage
        data={{
          title: data.fifthSection.title,
          subtitle: data.fifthSection.description,
          tabs: data.fifthSection.items.map((item) => ({
            title: item.title,
            image: item.image,
          })),
        }}
      />
      <InnerCta
        data={{
          bgImage: data.sixthSection.image,
          title: data.sixthSection.title,
        }}
        maxW="max-w-[18ch]"
      />
    </>
  );
};

export default Index;
