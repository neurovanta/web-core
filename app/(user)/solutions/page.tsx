import Index from "@/app/components/client/solutions/Index";
import { getSolutions } from "@/lib/services/solutions.service";
import { SolutionType } from "@/app/types/solution";

const page = async () => {
  const data: SolutionType = await getSolutions();
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
