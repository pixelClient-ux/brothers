import { getMembers } from "@/app/(api)/getMembers";
import MemberList from "./memberList";
import { Suspense } from "react";
import MemberListSkeleton from "@/components/MemberListSkeleton";

interface PageProps {
  searchParams: {
    status?: string;
    page?: string;
    range?: string;
  };
}

export default async function page({ searchParams }: PageProps) {
  const { page, status, range } = await searchParams;
  return (
    <div>
      <Suspense fallback={<MemberListSkeleton />} key={`${range}-${status}`}>
        <MemeberListContent page={page} status={status} range={range} />
      </Suspense>
    </div>
  );
}

async function MemeberListContent({
  page,
  status,
  range,
}: {
  page?: string;
  range?: string;
  status?: string;
}) {
  const { data, total } = await getMembers({
    searchParams: { range, status, page },
  });
  if (!data || data.length === 0) {
    return <NoDataAvailable />;
  }

  return <MemberList data={data} total={total} />;
}

function NoDataAvailable() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m4 0H5m14 0a2 2 0 01-2 2H7a2 2 0 01-2-2m14 0V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10"
        />
      </svg>
      <h3 className="text-2xl font-semibold text-gray-700">No Members Found</h3>
      <p className="max-w-xs text-center text-gray-500">
        There are no members matching your current filters. Try adjusting your
        search or filter settings.
      </p>
    </div>
  );
}
