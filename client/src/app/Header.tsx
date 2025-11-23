"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  QrCode,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Members", href: "/members", icon: Users },
  { title: "Scan", href: "/scan", icon: QrCode },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function GymTopNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-800 bg-[#1C1F26] px-6 py-4 md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <Dumbbell className="text-primary h-6 w-6" />
        <span className="text-lg font-bold text-white">Gym-Fitness</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Menu className="h-6 w-6 text-gray-400" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-sm bg-[#1C1F26] p-6 text-white"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <Dumbbell className="text-primary" size={30} />
              <div className="text-xl font-bold text-white uppercase">
                Gym-Fitness
              </div>
            </SheetTitle>
          </SheetHeader>

          <ul className="mt-6 flex flex-col gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.title}>
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className={clsx(
                        "w-full justify-start gap-2 rounded-none px-3 py-6",
                        isActive
                          ? "bg-primary font-semibold text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
