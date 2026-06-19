import InnerBanner from "../common/InnerBanner";
import Main from "./sections/Main";
import ContactMap from "./sections/ContactMap";
import { ContactType } from "@/app/types/contact";

const Index = ({ data }: { data: ContactType }) => {
  return (
    <>
      <InnerBanner data={data.bannerSection} maxWTitle="max-w-[85ch]" />
      <Main data={data.firstSection} />
      <ContactMap data={data.secondSection} />
    </>
  );
};

export default Index;
