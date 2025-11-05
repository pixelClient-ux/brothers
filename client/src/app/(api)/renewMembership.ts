interface renewMembershipProps {
  _id: string;
  membershipPeriod: string;
  paymentMethod: "cash" | "cbe" | "tele-birr" | "transfer";
  amount: string;
}
export const renewMembership = async (data: renewMembershipProps) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/members/renew/${data._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: data.membershipPeriod,
          method: data.paymentMethod,
          amount: data.amount,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to renew membership: ${errorText}`);
    }

    // Return the updated member data or success message
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error renewing membership:", error);
    throw error;
  }
};
