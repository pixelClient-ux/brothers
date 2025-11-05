import mongoose, { Model, Schema, model, Document } from "mongoose";

export interface IMember {
  fullName: string;
  phone: string;
  gender: "male" | "female" | "other";
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
    gender: { type: String, enum: ["male", "female"], default: "other" },
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

memberSchema.methods.renewMembership = function (
  months: number = 1,
  amount: number,
  method: "cash" | "cbe" | "tele-birr" | "transfer" = "cash"
) {
  const now = new Date();

  if (this.membership?.endDate && this.membership.status === "active") {
    const currentEnd = new Date(this.membership.endDate);
    const newEnd = new Date(currentEnd);
    newEnd.setMonth(currentEnd.getMonth() + months);
    this.membership.endDate = newEnd;
    this.membership.durationMonths += months;
  } else {
    const newStart = now;
    const newEnd = new Date();
    newEnd.setMonth(newStart.getMonth() + months);
    this.membership.startDate = newStart;
    this.membership.endDate = newEnd;
    this.membership.durationMonths = months;
  }

  this.membership.status = "active";

  this.payments.push({
    amount,
    date: now,
    method,
  });

  return this.save();
};

const Member: Model<IMemberDocument> =
  mongoose.models.Member || model<IMemberDocument>("Member", memberSchema);

export default Member;
