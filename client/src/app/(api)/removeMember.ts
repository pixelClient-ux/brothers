export const removeMember = async (memberId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/members/${memberId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete member: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};
