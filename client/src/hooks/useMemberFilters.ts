// hooks/useMemberFilters.ts
"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function useMemberFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [range, setRange] = useState(searchParams.get("range") || "all");
  const [isSearching, setIsSearching] = useState(false);

  // Update URL params cleanly
  const updateParams = useCallback(
    (params: Record<string, string | null>) => {
      const p = new URLSearchParams(window.location.search);

      Object.entries(params).forEach(([key, value]) => {
        if (!value || value === "all") p.delete(key);
        else p.set(key, value);
      });

      p.delete("page");

      router.push(`?${p.toString()}`, { scroll: false });
    },
    [router],
  );

  // Debounced search
  const debounced = useDebouncedCallback((val: string) => {
    const trimmed = val.trim();
    if (trimmed) {
      updateParams({ q: trimmed, status: "all", range: "all" });
      setStatus("all");
      setRange("all");
    } else {
      updateParams({ q: null });
    }
    setIsSearching(false);
  }, 400);

  return {
    search,
    status,
    range,
    isSearching,
    setSearch,
    setStatus,
    setRange,
    updateParams,
    debounced,
    hasSearch: !!search,
  };
}
