"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <div className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 md:flex-row lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-32 bg-slate-700" />
                <Skeleton className="h-6 w-40 bg-slate-700" />
              </div>
              <Skeleton className="h-4 w-64 bg-slate-800" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[180px] bg-slate-700" />
              <Skeleton className="bg-primary/40 h-10 w-28" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-none bg-[#1C1F26] p-6 shadow-lg transition-all duration-300"
              >
                <Skeleton className="mb-2 h-4 w-32 bg-slate-700" />
                <Skeleton className="mb-3 h-8 w-20 bg-slate-600" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full bg-slate-700" />
                  <Skeleton className="h-4 w-16 bg-slate-700" />
                  <Skeleton className="h-3 w-20 bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
