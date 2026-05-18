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

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} maxWTitle="max-w-[54ch]" />
      <SectionHeader {...sectionHeaderData} maxWTitle="max-w-[15ch]" maxWSubtitle="max-w-[48ch]" maxWDescription="max-w-[65ch] 3xl:max-w-[80ch]" />
      <HighlightSlider />
      <Discovery />
      <CurveSlider {...longevityInnovationData} />
    </>
  );
};

export default Index;
