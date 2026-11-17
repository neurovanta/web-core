import AdminSidebar from "@/app/components/admin/AdminSidebar/Index";
import { getCurrentAdminName } from "@/lib/getCurrentAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = await getCurrentAdminName();

  return (
    <div className="flex h-screen bg-cream-bg">
      <AdminSidebar username={username} />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-8 pb-8 pt-15 bg-[#F4F1EC] bg-[radial-gradient(ellipse_at_top_right,rgba(191,163,115,0.12),transparent_50%)]">
          {children}
        </div>
      </main>
    </div>
  );
}
