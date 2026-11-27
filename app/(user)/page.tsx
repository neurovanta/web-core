import Index from "@/app/components/client/home/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getHome } from "@/lib/services/home.service";
import { HomePageData } from "@/app/types/home";
import { pageMetadata } from "@/lib/seo";

// Same cached call as the page below, so the DB is read once.
export async function generateMetadata() {
  const data: HomePageData = await getHome();
  return pageMetadata(data.home?.seo, "/");
}

const page = async () => {
  const data: HomePageData = await getHome();
  return (
    <>
      <SeoScript script={data.home?.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
