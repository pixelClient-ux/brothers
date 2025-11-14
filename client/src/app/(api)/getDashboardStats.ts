// lib/dashboard.ts

import { GetDashboardStatsResponse } from "@/lib/dashboardTypes";

interface GetDashboardStatsProps {
  searchParams?: {
    range?: string;
  };
}

export const getDashboardStats = async ({
  searchParams,
}: GetDashboardStatsProps): Promise<GetDashboardStatsResponse> => {
  const query = new URLSearchParams();

  if (searchParams?.range) query.append("range", searchParams.range);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/members/stats?${query.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch dashboard stats");
  }

  const result: GetDashboardStatsResponse = await response.json();
  return result;
};
