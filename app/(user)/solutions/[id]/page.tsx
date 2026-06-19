import Index from "@/app/components/client/solution-details/Index";
import { getSolutionBySlug } from "@/lib/services/solutions.service";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const data = await getSolutionBySlug(id);
  return <Index data={data} />;
};

export default page;
