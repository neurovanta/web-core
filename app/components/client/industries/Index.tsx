import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import DescImageIntro from "../common/DescImageIntro";
import IndustriesWeServe from "./sections/IndustriesWeServe";
import { Industries } from "@/app/types/industry";

const Index = ({ data }: { data: Industries }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} />
      <DescImageIntro data={data.firstSection} />
      <IndustriesWeServe data={{ title: data.secondSection.title, items: data.industries }} />
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
