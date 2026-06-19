import InnerBanner from "../common/InnerBanner";
import SectionHeader from "../common/SectionHeader";
import InfiniteClients from "./sections/InfiniteClients";
import Purposes from "./sections/Purposes";
import InnerCta from "../common/InnerCta";
import CommonSlider from "../common/CommonSlider";
import TabsImage from "../common/TabsImage";
import { AboutType } from "@/app/types/about";

const Index = ({ data }: { data: AboutType }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} />
      <SectionHeader data={data.firstSection} maxWDescription="max-w-[949px]" />
      <Purposes data={data.secondSection} />
      <CommonSlider
        data={{
          heading: data.thirdSection.title,
          slides: data.thirdSection.items.map((item) => ({
            icon: item.icon,
            title: item.title,
          })),
        }}
      />
      <TabsImage
        data={{
          title: data.fourthSection.title,
          subtitle: data.fourthSection.description,
          tabs: data.fourthSection.items.map((item) => ({
            title: item.title,
            image: item.image,
          })),
        }}
      />
      <InfiniteClients data={data.fifthSection} />
      <InnerCta
        data={{
          bgImage: data.sixthSection.image,
          title: data.sixthSection.title,
        }}
        maxW="max-w-[19ch]"
      />
    </>
  );
};

export default Index;
