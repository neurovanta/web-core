import { isShown } from "@/app/components/client/common/isShown";
import InnerBanner from "../common/InnerBanner";
import Main from "./sections/Main";
import ContactMap from "./sections/ContactMap";
import { ContactType } from "@/app/types/contact";

const Index = ({ data }: { data: ContactType }) => {
  return (
    <>
      {isShown(data.bannerSection) && (
        <InnerBanner data={data.bannerSection} maxWTitle="max-w-[85ch]" />
      )}
      {isShown(data.firstSection) && <Main data={data.firstSection} />}
      {isShown(data.secondSection) && <ContactMap data={data.secondSection} />}
    </>
  );
};

export default Index;
