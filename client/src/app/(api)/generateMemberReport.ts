import toast from "react-hot-toast";

interface GetMemberProps {
  searchParams: {
    status?: string;
    page?: string;
    range?: string;
    search?: string;
  };
}

/**
 * Generate and download a filtered Member Report (PDF)
 * Works like `getMembers` but fetches binary (PDF) data.
 */
export const generateReport = async ({ searchParams }: GetMemberProps) => {
  const query = new URLSearchParams();

  if (searchParams.status) query.append("status", searchParams.status);
  if (searchParams.range) query.append("range", searchParams.range);
  if (searchParams.search) query.append("search", searchParams.search);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/members/reports?${query.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to generate report");
    }

    // Convert response to Blob (PDF)
    const blob = await response.blob();
    const pdfUrl = window.URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "gym_member_report.pdf";
    document.body.appendChild(link);
    link.click();

    // Clean up
    window.URL.revokeObjectURL(pdfUrl);
    document.body.removeChild(link);
  } catch (error) {
    console.error("Report generation failed:", error);
    toast.error("Failed to generate report. Please try again.");
  }
};
