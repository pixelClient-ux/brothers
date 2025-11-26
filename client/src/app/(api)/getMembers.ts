// app/(api)/getMembers.ts
import { MemberType } from "@/lib/memeberType";
import { cookies } from "next/headers";

interface GetMemberProps {
  searchParams: {
    q?: string;
    status?: string;
    page?: string;
    range?: string;
    search?: string; // backward compatibility
  };
}

interface GetMembersResponse {
  status: string;
  data: MemberType[];
  total: number;
}

export const getMembers = async ({
  searchParams,
}: GetMemberProps): Promise<GetMembersResponse> => {
  const query = new URLSearchParams();

  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value || "";

  // Only add params if they exist and are not "all"
  if (searchParams.q?.trim()) {
    query.append("q", searchParams.q.trim());
  }

  if (searchParams.status && searchParams.status !== "all") {
    query.append("status", searchParams.status);
  }

  if (searchParams.page && parseInt(searchParams.page) > 0) {
    query.append("page", searchParams.page);
  }

  if (searchParams.range && searchParams.range !== "all") {
    query.append("range", searchParams.range);
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/members?${query.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Cookie: `jwt=${jwt}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Failed to fetch members (Status: ${response.status})`,
    );
  }

  const result = await response.json();
  return result as GetMembersResponse;
};
