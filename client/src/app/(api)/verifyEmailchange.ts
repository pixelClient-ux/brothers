export default async function verfyEmailChange(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/confirm-email/${token}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  return data;
}
