import { MemberType } from "@/lib/memeberType";

interface VerifyResponse {
  status: "success";
  data: {
    member: MemberType;
  };
}
export async function verifyMember(
  memberCode: string,
): Promise<VerifyResponse | null> {
  console.log("Client: Verifying member with code:", memberCode);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/members/verify/${memberCode}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const erroText = await res.json();
      console.error("Verification error:", erroText);
      return null;
    }

    const result: VerifyResponse = await res.json();

    return result;
  } catch (error) {
    console.error("Verification failed:", error);
    return null;
  }
}
