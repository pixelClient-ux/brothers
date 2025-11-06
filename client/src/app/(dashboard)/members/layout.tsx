"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUp, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFromUrl = searchParams.get("status") || "all";
  const [activeFilter, setActiveFilter] = useState(statusFromUrl);
  const rangeFromUrl = searchParams.get("range") || "all";
  const [selectedRange, setSelectedRange] = useState(rangeFromUrl);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const filters = ["all", "active", "expired"];
  const filterRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeEl = filterRefs.current[activeFilter];
    if (activeEl) {
      setUnderlineStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeFilter]);
  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="flex w-full flex-col items-center justify-center gap-5 md:justify-between lg:flex-row">
          <div>
            <h1 className="text-2xl font-bold">Manage Members</h1>
            <p className="text-muted-foreground">
              View and manage all gym members.
            </p>
          </div>
        </div>

        <div className="relative mt-6 flex gap-6 border-b border-gray-700 pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              ref={(el) => {
                filterRefs.current[filter] = el;
              }}
              onClick={() => {
                setActiveFilter(filter);
                updateQueryParams({ status: filter });
              }}
              className={`pb-1 font-medium transition-colors ${
                activeFilter === filter
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}

          <span
            className="bg-primary absolute bottom-0 h-0.5 transition-all duration-300"
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          />
        </div>

        <div className="lg: mt-3 flex flex-col items-center justify-between gap-4 md:items-start xl:flex-row">
          <div className="border-muted-foreground focus-within:border-primary flex items-center gap-2 rounded-none border px-3 transition-colors">
            <Search />
            <input
              placeholder="Search for member"
              className="border-none px-6 py-2 outline-none active:border-none"
            />
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="text-white">
                3 <span>member selected</span>
              </div>
              <Button variant="destructive" className="rounded-none">
                <Trash />
                <span>Delete</span>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={selectedRange}
                onValueChange={(value) => {
                  setSelectedRange(value);
                  updateQueryParams({ range: value });
                }}
              >
                <SelectTrigger className="w-[180px] rounded-none bg-[#1C1F26] text-white">
                  <SelectValue placeholder="Export for..." />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-[#1C1F26] text-white">
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Button className="flex items-center gap-2 rounded-none">
                <FileUp className="h-4 w-4" /> Export Members
              </Button>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
