export const updateAdminProfile = async (updatedData: FormData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/update-profile`,
    {
      method: "PATCH",
      credentials: "include",
      body: updatedData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Somethin went wrong,please try agin");
  }

  const result = await response.json();

  return result.message;
};
