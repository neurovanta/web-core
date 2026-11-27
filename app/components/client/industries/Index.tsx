import { isShown } from "@/app/components/client/common/isShown";
import InnerBanner from "../common/InnerBanner";
import InnerCta from "../common/InnerCta";
import DescImageIntro from "../common/DescImageIntro";
import IndustriesWeServe from "./sections/IndustriesWeServe";
import { Industries } from "@/app/types/industry";

const Index = ({ data }: { data: Industries }) => {
  return (
    <>
      {isShown(data.bannerSection) && <InnerBanner data={data.bannerSection} />}
      {isShown(data.firstSection) && (
        <DescImageIntro data={data.firstSection} />
      )}
      {isShown(data.secondSection) && (
        <IndustriesWeServe
          data={{ title: data.secondSection.title, items: data.industries }}
        />
      )}
      {isShown(data.thirdSection) && (
        <InnerCta
          data={{
            bgImage: data.thirdSection.image,
            title: data.thirdSection.title,
          }}
          maxW="max-w-[18ch]"
        />
      )}
    </>
  );
};

export default Index;
