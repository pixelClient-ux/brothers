// components/HeroLoadingskeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <div className="w-full bg-slate-900">
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 md:flex-row lg:justify-between">
          <div className="space-y-4">
            <Skeleton className="h-8 w-60 rounded-none" />
            <Skeleton className="h-6 w-40 rounded-none" />
            <Skeleton className="h-4 w-80 rounded-none" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36 rounded-none" />
            <Skeleton className="h-10 w-36 rounded-none" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-none bg-[#1C1F26] p-6 shadow-lg">
              <Skeleton className="mb-2 h-4 w-24 rounded-none" />
              <Skeleton className="mb-2 h-8 w-32 rounded-none" />
              <Skeleton className="h-4 w-16 rounded-none" />
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Line Chart */}
          <div className="rounded-lg bg-[#1C1F26] p-6 shadow-lg">
            <Skeleton className="mb-4 h-6 w-48 rounded-none" />
            <Skeleton className="h-72 w-full rounded-none" />
          </div>

          {/* Bar Chart */}
          <div className="rounded-lg bg-[#1C1F26] p-6 shadow-lg">
            <Skeleton className="mb-4 h-6 w-48 rounded-none" />
            <Skeleton className="h-72 w-full rounded-none" />
          </div>

          {/* Status Pie */}
          <div className="flex flex-col items-center rounded-lg bg-[#1C1F26] p-6 shadow-lg">
            <Skeleton className="mb-4 h-6 w-52 rounded-none" />
            <div className="relative h-72 w-72">
              {/* Simulate slices */}
              <Skeleton className="absolute top-0 left-0 h-72 w-72 rounded-full" />
              <Skeleton className="absolute top-4 left-4 h-64 w-64 rounded-full bg-slate-900" />
              <Skeleton className="absolute top-20 left-20 h-32 w-32 rounded-full" />
            </div>
            {/* Labels */}
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </div>

          {/* Gender Pie */}
          <div className="flex flex-col items-center rounded-lg bg-[#1C1F26] p-6 shadow-lg">
            <Skeleton className="mb-4 h-6 w-52 rounded-none" />
            <div className="relative h-72 w-72">
              <Skeleton className="absolute top-0 left-0 h-72 w-72 rounded-full" />
              <Skeleton className="absolute top-4 left-4 h-64 w-64 rounded-full bg-slate-900" />
              <Skeleton className="absolute top-20 left-20 h-32 w-32 rounded-full" />
            </div>
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
