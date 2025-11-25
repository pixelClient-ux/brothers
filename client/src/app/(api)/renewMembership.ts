import { reneMemberData } from "@/components/RenewMember";

interface RenewMemberProps {
  data: reneMemberData;
  memberId: string;
}
export const renewMembership = async ({ data, memberId }: RenewMemberProps) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/members/renew/${memberId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          months: data.membershipPeriod,
          method: data.paymentMethod,
          amount: data.amount,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to renew membership");
    }

    // Return the updated member data or success message
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error renewing membership:", error);
    throw error;
  }
};
