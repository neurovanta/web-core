import Index from "@/app/components/client/experience/Index";
import { ExperienceType } from "@/app/types/experience";
import { getExperience } from "@/lib/services/experience.service";

const page = async () => {
  const data: ExperienceType = await getExperience();
  
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
