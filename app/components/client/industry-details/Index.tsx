import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import DescImageIntro from "../common/DescImageIntro";
import FourCardSlider from "../common/FourCardSlider";
import CommonSlider from "../common/CommonSlider";
import HowItFits from "../solution-details/sections/HowFits";
import { IndividualIndustry } from "@/app/types/industry";

const Index = ({ data }: { data: IndividualIndustry }) => {
  return (
    <>
      {!data.bannerSection?.isHidden && (
        <InnerBanner data={data.bannerSection} maxWTitle="max-w-[62ch]" />
      )}
      {!data.firstSection?.isHidden && (
        <DescImageIntro data={data.firstSection} />
      )}
      {!data.secondSection?.isHidden && (
        <FourCardSlider data={data.secondSection} />
      )}
      {/* Benefits */}
      {!data.thirdSection?.isHidden && (
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
      {!data.fourthSection?.isHidden && (
        <HowItFits data={data.fourthSection} />
      )}
      {!data.fifthSection?.isHidden && (
        <InnerCta
          data={{
            bgImage: data.fifthSection.image || "/assets/placeholder.png",
            title: data.fifthSection.title,
          }}
          maxW="max-w-[18ch]"
        />
      )}
    </>
  );
};

export default Index;
