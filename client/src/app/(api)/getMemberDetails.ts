import { MemberType } from "@/lib/memeberType";
import { cookies } from "next/headers";

interface memberDetailsResponse {
  status: "success";
  data: {
    member: MemberType;
  };
}
export default async function getMemebrDetails(memberCode: string) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value || "";
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/getMemebrDetails/${memberCode}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Cookie: `jwt=${jwt}`,
      },
    },
  );

  if (!result.ok) {
    const errorText = await result.text();
    console.error("Error fetching member details:", errorText);
    return null;
  }
  const data: memberDetailsResponse = await result.json();
  return data;
}
