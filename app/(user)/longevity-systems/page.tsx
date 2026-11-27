import Index from "@/app/components/client/systems/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getSystems } from "@/lib/services/systems.service";
import { Systems } from "@/app/types/system";
import { pageMetadata } from "@/lib/seo";

// Same cached call as the page below, so the DB is read once.
export async function generateMetadata() {
  const data: Systems = await getSystems();
  return pageMetadata(data.seo, "/longevity-systems");
}

const page = async () => {
  const data: Systems = await getSystems();
  return (
    <>
      <SeoScript script={data.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
