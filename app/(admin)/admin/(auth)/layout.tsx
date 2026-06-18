import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ClientSideLink from "../client-side-link";
import AdminNavbar from "@/app/components/admin/AdminNavbar/Index";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-cream-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col h-screen overflow-y-auto border-r border-border-color">
        <div className="flex-1">
          <div className="mb-6 px-4 flex flex-col gap-2 bg-cream-bg py-30 border-b border-border-color">
            <div className="flex items-center justify-center">
              <Image
                src="/assets/logos/header-logo-full.svg"
                alt="Logo"
                width={180}
                height={180}
              />
            </div>
          </div>

          <nav className="space-y-1">
            <AdminNavbar />
          </nav>
        </div>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border-color">
          <ClientSideLink
            href="/admin/logout"
            name="Logout"
            icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto px-8 pb-8 pt-15 bg-gray-200">{children}</div>
      </main>
    </div>
  );
}
