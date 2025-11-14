import { MemberType } from "@/lib/memeberType";

interface GetMemberProps {
  searchParams: {
    status?: string;
    page?: string;
    range?: string;
  };
}

interface getMembersResponse {
  status: string;
  data: MemberType[];
  total: number;
}

export const getMembers = async ({
  searchParams,
}: GetMemberProps): Promise<getMembersResponse> => {
  const query = new URLSearchParams();

  if (searchParams.status) query.append("status", searchParams.status);
  if (searchParams.page) query.append("page", searchParams.page);
  if (searchParams.range) query.append("range", searchParams.range);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/members?${query.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch members");
  }

  const result = await response.json();
  return result;
};
