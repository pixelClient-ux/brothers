"use client";

import { useRef, useState, useEffect } from "react";
import { Search, X, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { generateReport } from "@/app/(api)/generateMemberReport";

import { useMemberFilters } from "@/hooks/useMemberFilters";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    search,
    status,
    range,
    isSearching,
    setSearch,
    setStatus,
    setRange,
    hasSearch,
    debounced,
    updateParams,
  } = useMemberFilters();

  const filterOptions = ["all", "active", "expired"];

  const filterRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  // Underline animation
  useEffect(() => {
    const btn = filterRefs.current[status];
    if (btn) {
      setUnderline({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      });
    }
  }, [status]);

  const handleReport = async () => {
    await generateReport({
      searchParams: {
        q: search || undefined,
        status: status || undefined,
        range: range || undefined,
      },
    });
  };

  return (
    <div className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
          <div>
            <h1 className="text-2xl font-bold">Manage Members</h1>
            <p className="text-muted-foreground">
              View and manage all gym members.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="relative mt-6 flex gap-6 border-b border-gray-700 pb-2">
          {filterOptions.map((f) => (
            <button
              key={f}
              ref={(el) => {
                filterRefs.current[f] = el;
              }}
              disabled={hasSearch}
              onClick={() => {
                setStatus(f);
                updateParams({ status: f });
              }}
              className={`pb-1 font-medium transition-colors ${
                status === f
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              } ${hasSearch ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}

          <span
            className="bg-primary absolute bottom-0 h-[2px] transition-all duration-300"
            style={{ left: underline.left, width: underline.width }}
          />
        </div>

        {/* Search + Export */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 xl:flex-row">
          {/* Search Box */}
          <div className="border-muted-foreground relative flex items-center gap-2 border px-3">
            <Search className="h-4 w-4" />

            <input
              value={search}
              onChange={(e) => {
                const v = e.target.value;
                setSearch(v);
                if (v.trim()) setStatus("all");
                debounced(v);
              }}
              placeholder="Search for member"
              className="w-64 border-none bg-transparent py-2 outline-none"
            />

            {isSearching && (
              <div className="absolute right-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
            )}

            {search && !isSearching && (
              <button
                onClick={() => {
                  setSearch("");
                  updateParams({ q: null });
                }}
                className="absolute right-3 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Export */}
          <div className="flex items-center gap-3">
            <Select
              value={range}
              disabled={hasSearch}
              onValueChange={(v) => {
                setRange(v);
                updateParams({ range: v });
              }}
            >
              <SelectTrigger className="w-[180px] rounded-none bg-[#1C1F26] text-white">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1F26] text-white">
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="flex items-center gap-2 rounded-none"
              onClick={handleReport}
            >
              <FileUp className="h-4 w-4" /> Export Members
            </Button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
