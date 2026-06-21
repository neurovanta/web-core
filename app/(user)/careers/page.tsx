import Index from "@/app/components/client/careers/Index";
import { getCareers } from "@/lib/services/careers.service";
import { Careers } from "@/app/types/career";

const page = async () => {
  const data: Careers = await getCareers();
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
