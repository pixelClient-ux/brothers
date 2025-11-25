import toast from "react-hot-toast";

interface DashboardParams {
  searchParams?: {
    range?: string;
  };
}

export const generateDashboardReport = async (params: DashboardParams) => {
  try {
    const query = new URLSearchParams();

    if (params.searchParams?.range) {
      query.append("range", params.searchParams.range);
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard-report?${query.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!res.ok) {
      const erroData = await res.json();
      throw new Error(erroData.message || "Failed generating dashboard report");
    }

    const blob = await res.blob();
    const pdfUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = pdfUrl;

    const fileName = `dashboard_report_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    URL.revokeObjectURL(pdfUrl);
  } catch (error) {
    console.error(error);
    toast.error("Failed to download dashboard report");
  }
};
