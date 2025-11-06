export interface memberType {
  _id: string;
  fullName: string;
  phone: string;
  gender: "male" | "female";
  role: "member";
  avatar: string;
  isActive: boolean;
  payments: {
    amount?: number;
    date: Date;
    method: "cash" | "cbe" | "tele-birr" | "transfer";
  }[];
  membership?: {
    startDate?: Date;
    endDate?: Date;
    durationMonths?: number;
    status?: string;
  };
}
