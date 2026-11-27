import Index from "@/app/components/client/experience/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getExperience } from "@/lib/services/experience.service";
import { ExperienceType } from "@/app/types/experience";
import { pageMetadata } from "@/lib/seo";

// Same cached call as the page below, so the DB is read once.
export async function generateMetadata() {
  const data: ExperienceType = await getExperience();
  return pageMetadata(data.seo, "/experience");
}

const page = async () => {
  const data: ExperienceType = await getExperience();
  return (
    <>
      <SeoScript script={data.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
