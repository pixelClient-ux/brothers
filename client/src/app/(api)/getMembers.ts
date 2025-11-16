import { MemberType } from "@/lib/memeberType";
import { cookies } from "next/headers";

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

  // 👇 FIX — must await here
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value || "";

  if (searchParams.status) query.append("status", searchParams.status);
  if (searchParams.page) query.append("page", searchParams.page);
  if (searchParams.range) query.append("range", searchParams.range);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/members?${query.toString()}`;

  // 👇 FIX — send cookie to backend
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Cookie: `jwt=${jwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch members");
  }

  const result = await response.json();
  return result;
};
