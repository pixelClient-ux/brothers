interface ResetPasswordProps {
  password: string;
  passwordConfirm: string;
  token: string;
}

export default async function resetPassword(data: ResetPasswordProps) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/resetPassword/${data.token}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Something went wrong, please try again",
    );
  }

  return await response.json();
}
