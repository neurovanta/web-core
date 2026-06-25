import { IndividualProduct } from "@/app/types/system";
import CurveSlider from "../common/CurveSlider";
import InnerBanner from "../common/InnerBanner";
import SectionHeader from "../common/SectionHeader";
import {
  bannerData,
  sectionHeaderData,
  longevityInnovationData,
} from "./data";
import Discovery from "./sections/Discovery";
import HighlightSlider from "./sections/HighlightSlider";

const Index = ({ data }: { data: IndividualProduct }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} maxWTitle="max-w-[54ch]" />
      {data?.firstSection.title && <SectionHeader data={data?.firstSection} maxWTitle="sm:max-w-[15ch]" maxWSubtitle="max-w-[55ch]" maxWDescription="max-w-[65ch] 3xl:max-w-[80ch]" />}
      {data?.secondSection.items.length > 0 && <HighlightSlider data={data?.secondSection} />}
      {data?.thirdSection.items.length > 0 && <Discovery data={data?.thirdSection} />}
      {data.fourthSection.items.length > 0 && <CurveSlider data={data.fourthSection} />}
    </>
  );
};

export default Index;
