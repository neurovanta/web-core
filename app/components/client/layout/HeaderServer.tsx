import Header from "@/app/components/client/layout/Header";
import { getGlobalNavItems } from "@/lib/services/globalNavItems.service";

export default async function HeaderServer() {
  const navData = await getGlobalNavItems();
  return <Header navData={navData} />;
}
