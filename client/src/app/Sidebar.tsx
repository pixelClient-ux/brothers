"use client";

import {
  Dumbbell,
  Users,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import useLogout from "@/hooks/useLogout";

export default function GymSidebar() {
  const { mutate } = useLogout();
  const pathname = usePathname();

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    { title: "Members", icon: Users, href: "/members" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ];

  function handlSignout() {
    mutate();
  }
  return (
    <Sidebar
      side="left"
      className="border-r border-gray-800 bg-[#1C1F26] text-white"
    >
      <SidebarHeader className="border-b bg-gray-900">
        <Link href="/" className="flex items-center gap-2 px-3 py-4">
          <Dumbbell className="text-primary h-6 w-6" />
          <h1 className="text-lg font-bold">Gym-Fitness</h1>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-gray-800">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={clsx(
                        "flex items-center gap-2 rounded-none px-3 py-2 transition-all",
                        isActive
                          ? "bg-primary font-semibold text-white"
                          : "hover:bg-gray-700 hover:text-white",
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon
                          className={clsx(
                            "h-5 w-5",
                            isActive ? "text-white" : "text-gray-400",
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-gray-900 p-4">
        <Button
          variant="link"
          className="cursor-pointer"
          onClick={handlSignout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
