import AdminSidebar from "@/app/components/admin/AdminSidebar/Index";
import { getCurrentAdminName } from "@/lib/getCurrentAdmin";
import AdminPageHeader from "@/app/components/admin/common/AdminPageHeader";
import { AdminVisitLinkProvider } from "@/app/components/admin/common/AdminVisitLink";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = await getCurrentAdminName();

  return (
    <div className="flex h-screen bg-cream-bg">
      <AdminSidebar username={username} />

      {/* Main Content: page header (title, breadcrumb, save button row) + scrollable page */}
      <AdminVisitLinkProvider>
        <main className="flex flex-1 flex-col overflow-hidden bg-[#F4F1EC]">
          <AdminPageHeader />
          <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6 bg-[radial-gradient(ellipse_at_top_right,rgba(191,163,115,0.12),transparent_50%)]">
            {children}
          </div>
        </main>
      </AdminVisitLinkProvider>
    </div>
  );
}
