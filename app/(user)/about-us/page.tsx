import Index from "@/app/components/client/about/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getAbout } from "@/lib/services/about.service";
import { AboutType } from "@/app/types/about";
import { pageMetadata } from "@/lib/seo";

// Same cached call as the page below, so the DB is read once.
export async function generateMetadata() {
  const data: AboutType = await getAbout();
  return pageMetadata(data.seo, "/about-us");
}

const page = async () => {
  const data: AboutType = await getAbout();
  return (
    <>
      <SeoScript script={data.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
