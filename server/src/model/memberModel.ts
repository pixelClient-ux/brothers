import mongoose, { Schema, model, Document, Model } from "mongoose";
import type { HydratedDocument, Query } from "mongoose";

/* -------------------------------------------------
   Ethiopian Calendar helpers
   ------------------------------------------------- */

/** Ethiopian date representation */
interface EthDate {
  year: number;
  month: number; // 1-13
  day: number; // 1-30 (Pagumē has 5 or 6 days)
}

/**
 * Convert a JavaScript Date (Gregorian) → Ethiopian date.
 * Uses the simple 7-year-8-month offset (good enough for membership dates).
 */
function toEthDate(greg: Date): EthDate {
  const jd = gregToJd(greg);
  return jdToEth(jd);
}

/**
 * Convert Ethiopian date → JavaScript Date (Gregorian, 00:00 UTC).
 */
function fromEthDate(eth: EthDate): Date {
  const jd = ethToJd(eth);
  return jdToGreg(jd);
}

/* ---- Julian Day Number helpers (simplified, accurate for 1900-2100) ---- */
function gregToJd(d: Date): number {
  const y = d.getUTCFullYear(),
    m = d.getUTCMonth() + 1,
    day = d.getUTCDate();
  let a = Math.floor((14 - m) / 12);
  let y2 = y + 4800 - a;
  let m2 = m + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}
function jdToGreg(jd: number): Date {
  let a = jd + 32044;
  let b = Math.floor((4 * a + 3) / 146097);
  let c = a - Math.floor((b * 146097) / 4);
  let d = Math.floor((4 * c + 3) / 1461);
  let e = c - Math.floor((1461 * d) / 4);
  let m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return new Date(Date.UTC(year, month - 1, day));
}
function jdToEth(jd: number): EthDate {
  const ethEpoch = 1723856; // JD of 1/1/0001 EC
  const jdn = jd - ethEpoch;
  const year = Math.floor(jdn / 365.25) + 1;
  const doy = jdn - Math.floor((year - 1) * 365.25);
  const month = Math.floor(doy / 30) + 1;
  const day = doy - (month - 1) * 30;
  return { year, month, day };
}
function ethToJd(eth: EthDate): number {
  const ethEpoch = 1723856;
  return (
    ethEpoch +
    (eth.year - 1) * 365 +
    Math.floor((eth.year - 1) / 4) +
    (eth.month - 1) * 30 +
    eth.day
  );
}

/* ---- Ethiopian month addition (keeps end-of-month) ---- */
function addEthMonths(eth: EthDate, months: number): EthDate {
  const origDay = eth.day;
  const targetMonth = eth.month + months;
  const newYear = eth.year + Math.floor((targetMonth - 1) / 13);
  const newMonth = ((targetMonth - 1) % 13) + 1;

  // Pagumē (month 13) has 5 days (6 in leap years)
  const isLeap =
    (newYear % 4 === 3 && newYear % 100 !== 3) || newYear % 400 === 3;
  const daysInTarget = newMonth === 13 ? (isLeap ? 6 : 5) : 30;

  const day = Math.min(origDay, daysInTarget);
  return { year: newYear, month: newMonth, day };
}

/* ---- Ethiopian days / months between two dates ---- */
function ethDaysBetween(start: EthDate, end: EthDate): number {
  const jdStart = ethToJd(start);
  const jdEnd = ethToJd(end);
  return jdEnd - jdStart + 1; // inclusive
}
function ethMonthsBetweenCountingPartialAsOne(
  start: EthDate,
  end: EthDate
): number {
  if (
    end.year < start.year ||
    (end.year === start.year && end.month < start.month)
  )
    return 0;

  let total = (end.year - start.year) * 13 + (end.month - start.month);
  if (end.day >= start.day) total += 1;
  return Math.max(1, total);
}

/* -------------------------------------------------
   Mongoose schema
   ------------------------------------------------- */

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
  isDeleted: boolean;
  deletedAt: Date;
}

export interface IMemberDocument extends IMember, Document {
  daysLeft: number; // Ethiopian days left
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

/* -------------------------------------------------
   Middleware – soft delete
   ------------------------------------------------- */
memberSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

/* -------------------------------------------------
   Virtual – Ethiopian days left
   ------------------------------------------------- */
memberSchema.virtual("daysLeft").get(function (this: IMemberDocument) {
  if (!this.membership?.endDate) return 0;

  const nowGreg = new Date();
  const endGreg = new Date(this.membership.endDate);
  endGreg.setHours(23, 59, 59, 999);

  const nowEth = toEthDate(nowGreg);
  const endEth = toEthDate(endGreg);

  const diff = ethDaysBetween(nowEth, endEth);
  return diff > 0 ? diff : 0;
});

/* -------------------------------------------------
   Pre-save – update status based on Ethiopian days
   ------------------------------------------------- */
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

/* -------------------------------------------------
   Instance method – renew membership (Ethiopian months)
   ------------------------------------------------- */
memberSchema.methods.renewMembership = async function (
  months = 1,
  amount?: number,
  method: "cash" | "cbe" | "tele-birr" | "transfer" = "cash"
): Promise<IMemberDocument> {
  const doc = this as IMemberDocument;
  const nowGreg = new Date();

  /* ----- Determine base Ethiopian date ----- */
  let baseEth: EthDate;
  let startEth: EthDate;

  if (doc.membership?.endDate) {
    const existingEndGreg = new Date(doc.membership.endDate);
    const currentlyActive = existingEndGreg.getTime() > nowGreg.getTime();

    if (currentlyActive) {
      baseEth = toEthDate(existingEndGreg);
      startEth = doc.membership.startDate
        ? toEthDate(new Date(doc.membership.startDate))
        : toEthDate(nowGreg);
    } else {
      baseEth = toEthDate(nowGreg);
      startEth = toEthDate(nowGreg);
    }
  } else {
    baseEth = toEthDate(nowGreg);
    startEth = toEthDate(nowGreg);
  }

  /* ----- Add Ethiopian months (preserve end-of-month) ----- */
  const newEndEth = addEthMonths(baseEth, months);
  const newEndGreg = fromEthDate(newEndEth);
  const newStartGreg = fromEthDate(startEth);

  /* ----- Compute duration (Ethiopian months) ----- */
  const durationMonths = ethMonthsBetweenCountingPartialAsOne(
    startEth,
    newEndEth
  );

  /* ----- Update membership object ----- */
  doc.membership = {
    startDate: newStartGreg,
    endDate: newEndGreg,
    durationMonths,
    status: "active",
  };

  /* ----- Record payment if amount supplied ----- */
  if (typeof amount === "number") {
    doc.payments = doc.payments || [];
    doc.payments.push({ amount, date: nowGreg, method });
  }

  await doc.save();
  return doc;
};

/* -------------------------------------------------
   Model export
   ------------------------------------------------- */
const Member: MemberModel =
  mongoose.models.Member ||
  model<IMemberDocument, MemberModel>("Member", memberSchema);

export default Member;
export type HydratedMember = HydratedDocument<IMemberDocument>;
