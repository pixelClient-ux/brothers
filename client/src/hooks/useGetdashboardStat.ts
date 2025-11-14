// hooks/useDashboardStats.ts
import { getDashboardStats } from "@/app/(api)/getDashboardStats";
import { GetDashboardStatsResponse } from "@/lib/dashboardTypes";
import { useQuery } from "@tanstack/react-query";

interface UseDashboardStatsProps {
  range?: string;
}

export function useDashboardStats({ range }: UseDashboardStatsProps) {
  const { data, isLoading, isError, error } = useQuery<
    GetDashboardStatsResponse,
    Error
  >({
    queryFn: () => getDashboardStats({ searchParams: { range } }),
    queryKey: ["dashboard", range], // refetch on range change
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!range,
  });

  return { data, isLoading, isError, error };
}
