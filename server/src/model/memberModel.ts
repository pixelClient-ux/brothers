import mongoose, { Schema, model, Document, Model, Query } from "mongoose";
import { nanoid } from "nanoid";

// Ethiopian Date Type
interface EthDate {
  year: number;
  month: number;
  day: number;
}

export interface AvatarType {
  url: string;
  publicId?: string | null;
}

// Convert Gregorian → Ethiopian
function toEth(d: Date): EthDate {
  const jd = Math.floor(d.getTime() / 86400000) + 2440588;
  const ethEpoch = 1723856;
  const r = jd - ethEpoch;

  const year = Math.floor(r / 365.25) + 1;
  const doy = r - Math.floor((year - 1) * 365.25);
  const month = Math.floor(doy / 30) + 1;
  const day = doy - (month - 1) * 30 + 1;

  return { year, month, day };
}

// Add months in Ethiopian calendar
function addEthMonths(d: EthDate, m: number): EthDate {
  const t = d.year * 13 + d.month - 1 + m;
  const y = Math.floor(t / 13);
  const mo = (t % 13) + 1;
  const isLeap = y % 4 === 3;
  const max = mo === 13 ? (isLeap ? 6 : 5) : 30;
  return { year: y, month: mo, day: Math.min(d.day, max) };
}

// Convert Ethiopian → Gregorian
function ethToGreg(eth: EthDate): Date {
  const ethEpoch = 1723856;
  const jd =
    ethEpoch +
    (eth.year - 1) * 365 +
    Math.floor((eth.year - 1) / 4) +
    (eth.month - 1) * 30 +
    eth.day -
    1; // adjustment for accuracy
  const time = (jd - 2440588) * 86400000;
  return new Date(time);
}

// Interfaces
export interface IMember {
  fullName: string;
  phone: string;
  gender: "male" | "female";
  role: "member";
  avatar: AvatarType;
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
  memberCode: string;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface IMemberDocument extends IMember, Document {
  daysLeft: number;
  renewMembership(
    months?: number,
    amount?: number,
    method?: string
  ): Promise<IMemberDocument>;
}

export type MemberModel = Model<IMemberDocument>;

// Schema
const memberSchema = new Schema<IMemberDocument, MemberModel>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    role: { type: String, enum: ["member"], default: "member" },
    avatar: {
      url: { type: String, default: "/images/profile.png" },
      publicId: { type: String, default: null },
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    memberCode: { type: String, unique: true, sparse: true },
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
      durationMonths: Number,
      status: { type: String, default: "active" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Soft delete filter
memberSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// Auto generate member code
memberSchema.pre("save", function (next) {
  if (this.isNew && !this.memberCode) {
    this.memberCode = `MEM-${nanoid(8).toUpperCase()}`;
  }
  next();
});

// Virtual: Days left in Ethiopian calendar
memberSchema.virtual("daysLeft").get(function () {
  if (!this.membership?.endDate) return 0;

  const today = toEth(new Date());
  const end = toEth(new Date(this.membership.endDate));

  const todayNum = today.year * 400 + today.month * 30 + today.day;
  const endNum = end.year * 400 + end.month * 30 + end.day;

  const daysLeft = endNum - todayNum;
  return Math.max(0, daysLeft);
});

// Auto update status based on Ethiopian calendar
memberSchema.pre("save", function (next) {
  if (this.membership) {
    this.membership.status = this.daysLeft > 0 ? "active" : "expired";
  }
  next();
});

// Renew membership (Ethiopian calendar logic)
memberSchema.methods.renewMembership = async function (
  months = 1,
  amount?: number,
  method: "cash" | "cbe" | "tele-birr" | "transfer" = "cash"
) {
  const nowEth = toEth(new Date());

  // Base date: current end date if exists and not expired, otherwise today
  let baseEth = nowEth;
  if (this.membership?.endDate) {
    const currentEndEth = toEth(new Date(this.membership.endDate));
    const todayNum = nowEth.year * 400 + nowEth.month * 30 + nowEth.day;
    const endNum =
      currentEndEth.year * 400 + currentEndEth.month * 30 + currentEndEth.day;
    if (endNum >= todayNum) {
      baseEth = currentEndEth;
    }
  }

  const newEndEth = addEthMonths(baseEth, months);
  const newEndGreg = ethToGreg(newEndEth);

  this.membership = {
    startDate: this.membership?.startDate || new Date(),
    endDate: newEndGreg,
    durationMonths: (this.membership?.durationMonths || 0) + months,
    status: "active",
  };

  if (amount != null) {
    this.payments.push({
      amount,
      date: new Date(),
      method,
    });
  }

  await this.save();
  return this;
};

// Export Model
const Member: MemberModel =
  mongoose.models.Member ||
  model<IMemberDocument, MemberModel>("Member", memberSchema);

export default Member;
