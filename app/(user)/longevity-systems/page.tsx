import Index from "@/app/components/client/systems/Index";
import { Systems } from "@/app/types/system";
import { getSystems } from "@/lib/services/systems.service";

const page = async () => {
  const data: Systems = await getSystems();
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
