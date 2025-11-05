import { MemberEditType } from "@/components/EditMemberCard";

export const updateMember = async (data: MemberEditType) => {
  const { memberId, ...payload } = data;

  if (!memberId) {
    throw new Error("Member ID is required to update a member.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/renew/${memberId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const updatedMember = await response.json();
  return updatedMember;
};
