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
      const erroData = await response.json();
      throw new Error(erroData.message || "Failed to remove member");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};
