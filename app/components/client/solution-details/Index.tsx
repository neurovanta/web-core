import { isShown } from "@/app/components/client/common/isShown";
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
      {isShown(data.bannerSection) && <InnerBanner data={data.bannerSection} />}
      {isShown(data.firstSection) && (
        <SectionHeader
          data={data.firstSection}
          maxWSubtitle="max-w-[45ch]"
          maxWDescription="max-w-[909px]"
        />
      )}
      {isShown(data.secondSection) && (
        <FourCardSlider data={data.secondSection} />
      )}
      {isShown(data.thirdSection) && (
        <CommonSlider
          data={{
            heading: data.thirdSection.title,
            slides: data.thirdSection.items.map((item) => ({
              icon: item.icon,
              title: item.title,
            })),
          }}
        />
      )}
      {isShown(data.fourthSection) && <HowItFits data={data.fourthSection} />}
      {isShown(data.fifthSection) && data?.fifthSection?.items?.length > 0 && (
        <TabsImage
          data={{
            title: data.fifthSection.title,
            subtitle: data.fifthSection.description,
            tabs: data.fifthSection.items.map((item) => ({
              title: item.title,
              image: item.image || "/assets/placeholder.png",
            })),
          }}
        />
      )}
      {isShown(data.sixthSection) && (
        <InnerCta
          data={{
            bgImage: data.sixthSection.image || "/assets/placeholder.png",
            title: data.sixthSection.title,
          }}
          maxW="max-w-[18ch]"
        />
      )}
    </>
  );
};

export default Index;
