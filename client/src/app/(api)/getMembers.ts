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
  console.log("Query from fronedn", query);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/members?${query.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch members");
  }

  const result = await response.json();
  console.log(result.data);
  return result;
};
