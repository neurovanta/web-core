import Index from "@/app/components/client/about/Index";
import { getAbout } from "@/lib/services/about.service";
import { AboutType } from "@/app/types/about";

const page = async () => {
  const data: AboutType = await getAbout();
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
