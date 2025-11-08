import { signUpType } from "@/hooks/useSignup";

export default async function signUp(data: signUpType) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/signup`,
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
    throw new Error(errorData.message || "Somethin went wrong,please try agin");
  }

  const result = await response.json();

  return result.message;
}
