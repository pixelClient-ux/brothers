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
  const data = await getMembers({ searchParams: { range, status, page } });
  if (!data || data.length === 0) {
    return null;
  }

  return <MemberList data={data} />;
}
