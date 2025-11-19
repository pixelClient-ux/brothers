export const createMember = async (memberData: FormData) => {
  console.log(memberData);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/members/create`,
    {
      method: "POST",
      credentials: "include",
      body: memberData, // <-- just pass FormData
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create member");
  }

  const data = await response.json();
  return data;
};
