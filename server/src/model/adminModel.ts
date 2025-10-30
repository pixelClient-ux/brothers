import mongoose, { Document, Model, Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IAdmin {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
  passwordChangedAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export interface IAdminDocument extends IAdmin, Document {
  _id: Types.ObjectId;
  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  createPasswordResetToken(): string;
}

const adminSchema = new Schema<IAdminDocument>(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (el: string) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    avatar: { type: String, default: "/images/admin.png" },
    role: { type: String, default: "admin" },
    isActive: { type: Boolean, default: true },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  (this as any).passwordConfirm = undefined;
  next();
});
adminSchema.pre("save", async function (next) {
  if (!this.passwordChangedAt || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

adminSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

const Admin: Model<IAdminDocument> = model<IAdminDocument>(
  "Admin",
  adminSchema
);
export default Admin;
