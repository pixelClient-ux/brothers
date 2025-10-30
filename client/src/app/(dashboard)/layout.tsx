import { SidebarProvider } from "@/components/ui/sidebar";
import GymSidebar from "../Sidebar";
import GymTopNavbar from "../Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <GymTopNavbar />
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <GymSidebar />
          <main className="w-full bg-[#0F1117]">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
