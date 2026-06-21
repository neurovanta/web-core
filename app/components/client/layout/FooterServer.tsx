import { getGlobalNavItems } from "@/lib/services/globalNavItems.service";
import Footer from "@/app/components/client/layout/Footer";

export default async function FooterServer() {
  const navData = await getGlobalNavItems();
  return <Footer navData={navData} />;
}
