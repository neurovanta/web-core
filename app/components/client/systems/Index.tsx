import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import SectionHeader from "../common/SectionHeader";
import TabsWithSlider from "../common/TabsWithSlider";
import { Systems } from "@/app/types/system";

const Index = ({ data }: { data: Systems }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} />
      <SectionHeader
        data={data.firstSection}
        maxWTitle="sm:max-w-[12ch]"
        maxWSubtitle="max-w-[43ch]"
        maxWDescription="max-w-[75ch]"
      />
      <TabsWithSlider
        data={{
          heading: data.secondSection.title,
          description: data.secondSection.description,
          categories: data.secondSection.categories.map((cat) => ({
            label: cat.title,
            slides: cat.products.map((p) => ({
              image: p.thumbnailImage ?? "",
              imageAlt: p.thumbnailImageAlt,
              title: p.thumbnailTitle,
              href: `/longevity-systems/${p.slug ?? ""}`,
            })),
          })),
        }}
        className="bg-cream-bg py-[60px] lg:py-120"
      />
      <InnerCta
        data={{
          bgImage: data.thirdSection.image,
          title: data.thirdSection.title,
        }}
        maxW="max-w-[18ch]"
      />
    </>
  );
};

export default Index;
