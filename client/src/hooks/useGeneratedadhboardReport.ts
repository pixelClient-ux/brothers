import { generateDashboardReport } from "@/app/(api)/generateDashboardReport";
import { useMutation } from "@tanstack/react-query";

interface GenerateDashboardReportProps {
  range?: string;
}

export default function useGenerateDashboardReport() {
  const mutate = useMutation({
    mutationFn: ({ range }: GenerateDashboardReportProps) =>
      generateDashboardReport({
        searchParams: { range },
      }),
  });

  return { mutate };
}
