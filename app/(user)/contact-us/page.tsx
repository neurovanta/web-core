import Index from "@/app/components/client/contact-us/Index";
import SeoScript from "@/app/components/client/common/SeoScript";
import { getContact } from "@/lib/services/contact.service";
import { ContactType } from "@/app/types/contact";
import { pageMetadata } from "@/lib/seo";

// Same cached call as the page below, so the DB is read once.
export async function generateMetadata() {
  const data: ContactType = await getContact();
  return pageMetadata(data.seo, "/contact-us");
}

const page = async () => {
  const data: ContactType = await getContact();
  return (
    <>
      <SeoScript script={data.seo?.script} />
      <Index data={data} />
    </>
  );
};

export default page;
