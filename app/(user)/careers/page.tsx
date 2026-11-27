import Index from "@/app/components/client/careers/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getCareers } from "@/lib/services/careers.service";
import { Careers } from "@/app/types/career";
import { pageMetadata } from "@/lib/seo";

// Same cached call as the page below, so the DB is read once.
export async function generateMetadata() {
  const data: Careers = await getCareers();
  return pageMetadata(data.seo, "/careers");
}

const page = async () => {
  const data: Careers = await getCareers();
  return (
    <>
      <SeoScript script={data.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
