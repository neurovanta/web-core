import Index from "@/app/components/client/industry-details/Index";
import { getIndustryBySlug } from "@/lib/services/industries.service";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const data = await getIndustryBySlug(id);
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
