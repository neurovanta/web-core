import Index from "@/app/components/client/industries/Index";
import { getIndustries } from "@/lib/services/industries.service";
import { Industries } from "@/app/types/industry";

const page = async () => {
  const data: Industries = await getIndustries();
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
