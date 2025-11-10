import mongoose, { Schema, model, Document, Model } from "mongoose";
import type { HydratedDocument, Query } from "mongoose";

export interface IMember {
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
  isDeleted: Boolean;
  deletedAt: Date;
}

export interface IMemberDocument extends IMember, Document {
  daysLeft: number;
  renewMembership(
    months?: number,
    amount?: number,
    method?: "cash" | "cbe" | "tele-birr" | "transfer"
  ): Promise<IMemberDocument>;
}

export type MemberModel = Model<IMemberDocument>;

const memberSchema = new Schema<IMemberDocument, MemberModel>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    role: { type: String, enum: ["member"], default: "member" },
    avatar: { type: String, default: "/images/profile.png" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    payments: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        method: {
          type: String,
          enum: ["cash", "cbe", "tele-birr", "transfer"],
          default: "cash",
        },
      },
    ],

    membership: {
      startDate: Date,
      endDate: Date,
      durationMonths: { type: Number, default: 0 },
      status: { type: String, default: "active" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

function addMonthsKeepEndOfMonth(date: Date, months: number) {
  const origDay = date.getDate();
  const targetYear = date.getFullYear();
  const targetMonthIndex = date.getMonth() + months;
  const lastDayOfTargetMonth = new Date(
    targetYear,
    targetMonthIndex + 1,
    0
  ).getDate();
  const day = Math.min(origDay, lastDayOfTargetMonth);
  const newDate = new Date(targetYear, targetMonthIndex, day, 23, 59, 59, 999);
  return newDate;
}

function monthsBetweenCountingPartialAsOne(start: Date, end: Date) {
  if (!start || !end || end <= start) return 0;
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  let total = yearDiff * 12 + monthDiff;
  if (end.getDate() >= start.getDate()) total += 1;
  return Math.max(1, total);
}

memberSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

memberSchema.virtual("daysLeft").get(function (this: IMemberDocument) {
  if (!this.membership?.endDate) return 0;
  const now = new Date();
  const end = new Date(this.membership.endDate);
  end.setHours(23, 59, 59, 999);
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

memberSchema.pre("save", function (next) {
  const m = this.membership;
  if (m?.endDate) {
    const days = (this as IMemberDocument).daysLeft;
    if (days <= 0) {
      m.status = "expired";
    } else if (days <= 5) {
      m.status = `${days} day${days === 1 ? "" : "s"} left`;
    } else {
      m.status = "active";
    }
  }
  next();
});

memberSchema.methods.renewMembership = async function (
  months = 1,
  amount?: number,
  method: "cash" | "cbe" | "tele-birr" | "transfer" = "cash"
): Promise<IMemberDocument> {
  const doc = this as IMemberDocument;
  const now = new Date();

  const existingEnd = doc.membership?.endDate
    ? new Date(doc.membership.endDate)
    : null;
  const currentlyActive = existingEnd
    ? existingEnd.getTime() > now.getTime()
    : false;

  const baseDate =
    currentlyActive && existingEnd ? new Date(existingEnd) : new Date(now);
  const newEndDate = addMonthsKeepEndOfMonth(baseDate, months);

  const startDate = currentlyActive
    ? doc.membership?.startDate
      ? new Date(doc.membership.startDate)
      : new Date(now)
    : new Date(now);

  const durationMonths = monthsBetweenCountingPartialAsOne(
    startDate,
    newEndDate
  );

  doc.membership = {
    startDate,
    endDate: newEndDate,
    durationMonths,
    status: "active",
  };

  if (typeof amount === "number") {
    doc.payments = doc.payments || [];
    doc.payments.push({ amount, date: now, method });
  }

  await doc.save();
  return doc;
};

const Member: MemberModel =
  mongoose.models.Member ||
  model<IMemberDocument, MemberModel>("Member", memberSchema);

export default Member;
export type HydratedMember = HydratedDocument<IMemberDocument>;
