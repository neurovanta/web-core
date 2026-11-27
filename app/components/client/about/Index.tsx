import { isShown } from "@/app/components/client/common/isShown";
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
      {isShown(data.bannerSection) && <InnerBanner data={data.bannerSection} />}
      {isShown(data.firstSection) && (
        <SectionHeader
          data={data.firstSection}
          maxWDescription="max-w-[949px]"
        />
      )}
      {isShown(data.secondSection) && <Purposes data={data.secondSection} />}
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
      {isShown(data.fourthSection) && (
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
      )}
      {/* Clients: shown / hidden from Admin > About > Fifth Section (eye toggle) */}
      {isShown(data.fifthSection, true) && (
        <InfiniteClients data={data.fifthSection} />
      )}
      {isShown(data.sixthSection) && (
        <InnerCta
          data={{
            bgImage: data.sixthSection.image,
            title: data.sixthSection.title,
          }}
          maxW="max-w-[19ch]"
        />
      )}
    </>
  );
};

export default Index;
