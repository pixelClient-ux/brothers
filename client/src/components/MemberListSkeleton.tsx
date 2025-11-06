import { Skeleton } from "@/components/ui/skeleton";

export default function MemberListSkeleton() {
  return (
    <div className="space-y-5 overflow-x-auto">
      <div className="w-full min-w-[800px]">
        <Skeleton className="mt-3 mb-3 h-6 w-full rounded-none" />
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
  );
}
