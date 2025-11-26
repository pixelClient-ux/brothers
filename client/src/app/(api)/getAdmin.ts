import { AdminType } from "@/lib/AdminType";

export default async function getAdmin() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch admin data");
  }
  const result = await res.json();
  console.log("Admin Data:", result);
  return result.data.admin as AdminType;
}
