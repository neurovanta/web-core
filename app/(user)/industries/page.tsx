import Index from "@/app/components/client/industries/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getIndustries } from "@/lib/services/industries.service";
import { Industries } from "@/app/types/industry";
import { pageMetadata } from "@/lib/seo";

// Same cached call as the page below, so the DB is read once.
export async function generateMetadata() {
  const data: Industries = await getIndustries();
  return pageMetadata(data.seo, "/industries");
}

const page = async () => {
  const data: Industries = await getIndustries();
  return (
    <>
      <SeoScript script={data.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
