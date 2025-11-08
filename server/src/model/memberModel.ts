import mongoose, { Model, Schema, model, Document } from "mongoose";

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
}

export interface IMemberDocument extends IMember, Document {
  renewMembership(
    months: number,
    amount: number,
    method: string
  ): Promise<IMemberDocument>;
}

const memberSchema = new Schema<IMemberDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    gender: { type: String, enum: ["male", "female"] },
    role: { type: String, enum: ["member"], default: "member" },
    avatar: { type: String, default: "/images/profile.png" },
    isActive: { type: Boolean, default: true },
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
      startDate: { type: Date },
      endDate: { type: Date },
      durationMonths: { type: Number, default: 1 },
      status: { type: String, default: "active" },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

memberSchema.virtual("daysLeft").get(function () {
  if (!this.membership?.endDate) return null;
  const today = new Date();
  const end = new Date(this.membership.endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

memberSchema.pre("save", function (next) {
  if (this.membership?.startDate && this.membership?.durationMonths) {
    const start = new Date(this.membership.startDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + this.membership.durationMonths);
    this.membership.endDate = end;
  }

  if (this.membership?.endDate) {
    const now = new Date();
    const end = new Date(this.membership.endDate);
    const daysLeft = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft <= 0) this.membership.status = "expired";
    else if (daysLeft <= 5) this.membership.status = `${daysLeft} days left`;
    else this.membership.status = "active";
  }

  next();
});

memberSchema.methods.renewMembership = async function (
  months: number = 1,
  amount: number,
  method: "cash" | "cbe" | "tele-birr" | "transfer" = "cash"
) {
  const now = new Date();

  const addMonths = (date: Date, months: number) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  if (this.membership?.endDate && this.membership.status === "active") {
    // Extend from current endDate
    this.membership.endDate = addMonths(
      new Date(this.membership.endDate),
      months
    );
    this.membership.durationMonths += months;
  } else {
    // Start from today if expired or no membership
    this.membership.startDate = now;
    this.membership.endDate = addMonths(now, months);
    this.membership.durationMonths = months;
  }

  // Update status
  const today = new Date();
  this.membership.status =
    this.membership.endDate > today ? "active" : "expired";

  // Add payment
  this.payments.push({ amount, date: now, method });

  // Ensure member is active
  this.isActive = this.membership.status === "active";

  return this.save();
};

const Member: Model<IMemberDocument> =
  mongoose.models.Member || model<IMemberDocument>("Member", memberSchema);

export default Member;
