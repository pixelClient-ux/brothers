"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 bg-slate-900 px-5 py-6 text-white">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 bg-slate-700" />
        <Skeleton className="h-4 w-80 bg-slate-700" />
      </div>

      {/* Profile Image + Upload */}
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full bg-slate-700" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-32 bg-slate-700" />
        </div>
      </div>

      {/* Personal Info */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 bg-slate-700" />
        <Skeleton className="h-4 w-72 bg-slate-700" />

        <div className="space-y-4">
          <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
            <div className="w-full flex-1 space-y-3">
              <Skeleton className="h-4 w-24 bg-slate-700" />
              <Skeleton className="h-10 w-full rounded-none bg-slate-700" />
            </div>
            <div className="w-full flex-1 space-y-3">
              <Skeleton className="h-4 w-24 bg-slate-700" />
              <Skeleton className="h-10 w-full rounded-none bg-slate-700" />
            </div>
          </div>

          <div className="flex w-full justify-end">
            <Skeleton className="h-10 w-36 rounded-none bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 bg-slate-700" />
        <Skeleton className="h-4 w-72 bg-slate-700" />

        <div className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-40 bg-slate-700" />
            <Skeleton className="h-10 w-full rounded-none bg-slate-700" />
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full flex-1 space-y-3">
              <Skeleton className="h-4 w-40 bg-slate-700" />
              <Skeleton className="h-10 w-full rounded-none bg-slate-700" />
            </div>
            <div className="w-full flex-1 space-y-3">
              <Skeleton className="h-4 w-40 bg-slate-700" />
              <Skeleton className="h-10 w-full rounded-none bg-slate-700" />
            </div>
          </div>

          <div className="flex w-full justify-end">
            <Skeleton className="h-10 w-36 rounded-none bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
