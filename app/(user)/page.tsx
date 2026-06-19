import Index from "@/app/components/client/home/Index";
import { getHome } from "@/lib/services/home.service";
import { HomePageData } from "@/app/types/home";

const page = async () => {
  const data: HomePageData = await getHome();
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
