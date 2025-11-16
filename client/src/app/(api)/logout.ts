export async function logout() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/logout`, {
    method: "POST",
    credentials: "include",
  });
}
