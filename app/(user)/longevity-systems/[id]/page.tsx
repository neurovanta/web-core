import Index from "@/app/components/client/system-details/Index";
import { getSystemProductBySlug } from "@/lib/services/systems.service";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const data = await getSystemProductBySlug(id);
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
