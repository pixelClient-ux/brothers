"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MemberLoading() {
  return (
    <div className="animate-pulse bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6">
        <div className="flex w-full flex-col items-center justify-between gap-5 lg:flex-row">
          <div className="w-full max-w-sm space-y-2">
            <Skeleton className="h-8 w-48 rounded-none" />
            <Skeleton className="h-4 w-64 rounded-none" />
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-700 pb-2">
          <Skeleton className="h-6 w-16 rounded-none" />
          <Skeleton className="h-6 w-16 rounded-none" />
          <Skeleton className="h-6 w-16 rounded-none" />
          <Skeleton className="h-6 w-16 rounded-none" />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-10 w-full max-w-xs rounded-none" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-none" />
            <Skeleton className="h-10 w-44 rounded-none" />
          </div>
        </div>

        <div className="space-y-5 overflow-x-auto">
          <div className="w-full min-w-[800px]">
            <Skeleton className="mb-3 h-10 w-full rounded-none" />
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b border-gray-700 py-3"
              >
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-none" />
                <Skeleton className="h-6 w-24 rounded-none" />
                <Skeleton className="h-6 w-16 rounded-none" />
                <Skeleton className="h-6 w-20 rounded-none" />
                <Skeleton className="h-6 w-24 rounded-none" />
                <Skeleton className="h-6 w-20 rounded-none" />
                <Skeleton className="h-6 w-24 rounded-none" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-32 rounded-none" />
        </div>
      </div>
    </div>
  );
}
