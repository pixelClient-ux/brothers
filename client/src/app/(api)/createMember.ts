export type MemberDataType = {
  fullName: string;
  phone: string;
  gender: "male" | "female" | string;
  avatar: string;
  payments: {
    amount?: number;
    date: Date;
    method: "cash" | "cbe" | "tele-birr" | "transfer";
  }[];
  durationMonths?: string;
};
export const createMember = async (memberData: MemberDataType) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memberData),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create member");
  }

  const data = await response.json();
  return data;
};
