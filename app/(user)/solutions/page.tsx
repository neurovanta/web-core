import Index from "@/app/components/client/solutions/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getSolutions } from "@/lib/services/solutions.service";
import { SolutionType } from "@/app/types/solution";
import { pageMetadata } from "@/lib/seo";

// Same cached call as the page below, so the DB is read once.
export async function generateMetadata() {
  const data: SolutionType = await getSolutions();
  return pageMetadata(data.seo, "/solutions");
}

const page = async () => {
  const data: SolutionType = await getSolutions();
  return (
    <>
      <SeoScript script={data.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
