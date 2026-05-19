import InnerBanner from "../common/InnerBanner";
import { bannerData } from "./data";
import Main from "./sections/Main";
import ContactMap from "./sections/ContactMap";

const Index = () => {
  return (
    <>
      <InnerBanner {...bannerData} maxWTitle="max-w-[85ch]" />
      <Main />
      <ContactMap />
    </>
  );
};

export default Index;
