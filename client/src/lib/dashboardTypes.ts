// types/dashboardTypes.ts
export interface MonthlyMember {
  month: string; // "YYYY-MM"
  count: number;
}

export interface StatusBreakdown {
  active: number;
  expired: number;
  inactive: number;
}

export interface GenderBreakdown {
  male: number;
  female: number;
  other: number;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  totalRevenue: number;
  monthlyMembers: MonthlyMember[];
  status: StatusBreakdown;
  gender: GenderBreakdown;
}

export interface GetDashboardStatsResponse {
  status: "success" | "error";
  data: DashboardStats;
}
