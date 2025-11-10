export interface MemberType {
  _id: string;
  fullName: string;
  phone: string;
  gender: "male" | "female";
  role: "member";
  avatar: string;
  isActive: boolean;

  payments: {
    amount: number;
    date: string; // ✅ use string instead of Date for API responses
    method: "cash" | "cbe" | "tele-birr" | "transfer";
  }[];

  membership?: {
    startDate?: string;
    endDate?: string;
    durationMonths?: number;
    dayLeft?: number;
    status?: string;
  };

  createdAt: string;
  updatedAt?: string;
  daysLeft?: number;
}
