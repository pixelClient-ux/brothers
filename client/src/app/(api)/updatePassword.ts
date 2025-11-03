import { updatePasswordType } from "@/hooks/useUpdatePassword";

export default async function upadtePassword(data: updatePasswordType) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admins/update-profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Something went wrong,please try again",
    );
  }
  const result = await response.json();
  return result;
}
