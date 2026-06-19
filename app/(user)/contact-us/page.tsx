import Index from "@/app/components/client/contact-us/Index";
import { getContact } from "@/lib/services/contact.service";
import { ContactType } from "@/app/types/contact";

const page = async () => {
  const data: ContactType = await getContact();
  return (
    <>
      <Index data={data} />
    </>
  );
};

export default page;
