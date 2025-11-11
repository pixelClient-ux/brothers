interface updatedMemberProps {
  data: FormData;
  memberId: string;
}
export const updateMember = async ({ data, memberId }: updatedMemberProps) => {
  if (!memberId) {
    throw new Error("Member ID is required to update a member.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/updateMember/${memberId}`,
    {
      method: "PATCH",
      body: data,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const updatedMember = await response.json();
  return updatedMember;
};
