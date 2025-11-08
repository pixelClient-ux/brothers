interface updatedDataType {
  fullName?: string;
  email?: string;
}
export const updateAdminProfile = async (updatedData: updatedDataType) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/update-profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Somethin went wrong,please try agin");
  }

  const result = await response.json();

  return result.message;
};
