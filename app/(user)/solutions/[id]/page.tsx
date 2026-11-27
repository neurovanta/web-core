import { notFound } from "next/navigation";
import Index from "@/app/components/client/solution-details/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getSolutionBySlug } from "@/lib/services/solutions.service";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

// Unknown or hidden slug → 404 (notFound also adds noindex).
// Same cached call as the page below, so the DB is read once.
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const data = await getSolutionBySlug(id);
  if (!data) notFound();
  return pageMetadata(data.seo, `/solutions/${id}`);
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  const data = await getSolutionBySlug(id);
  if (!data) notFound();
  return (
    <>
      <SeoScript script={data.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
