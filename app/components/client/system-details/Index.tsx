import { isShown } from "@/app/components/client/common/isShown";
import { IndividualProduct } from "@/app/types/system";
import CurveSlider from "../common/CurveSlider";
import InnerBanner from "../common/InnerBanner";
import SectionHeader from "../common/SectionHeader";
import { bannerData, sectionHeaderData, longevityInnovationData } from "./data";
import Discovery from "./sections/Discovery";
import HighlightSlider from "./sections/HighlightSlider";

const Index = ({ data }: { data: IndividualProduct }) => {
  return (
    <>
      {isShown(data.bannerSection) && (
        <InnerBanner data={data.bannerSection} maxWTitle="max-w-[54ch]" />
      )}
      {isShown(data.firstSection) && data?.firstSection.title && (
        <SectionHeader
          data={data?.firstSection}
          maxWTitle="sm:max-w-[15ch]"
          maxWSubtitle="max-w-[55ch]"
          maxWDescription="max-w-[65ch] 3xl:max-w-[80ch]"
        />
      )}
      {isShown(data.secondSection) && data?.secondSection.items.length > 0 && (
        <HighlightSlider data={data?.secondSection} />
      )}
      {isShown(data.thirdSection) && data?.thirdSection.items.length > 0 && (
        <Discovery data={data?.thirdSection} />
      )}
      {isShown(data.fourthSection) && data.fourthSection.items.length > 0 && (
        <CurveSlider data={data.fourthSection} />
      )}
    </>
  );
};

export default Index;
