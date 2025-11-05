"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import Image from "next/image";
export type MemberEditType = {
  memberId: string;
  fullName: string;
  phone: string;
  gender: "male" | "female" | string;
  avatar: string;
  payments: {
    amount?: number;
    date: Date;
    method: "cash" | "cbe" | "tele-birr" | "transfer";
  }[];
  durationMonths?: string;
};
interface MemberCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMember: MemberEditType | null;
}

export default function EditMemberCard({
  open,
  onOpenChange,
  selectedMember,
}: MemberCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<MemberEditType>();

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMember) {
      const memberForForm: MemberEditType = {
        ...selectedMember,
        payments:
          selectedMember.payments && selectedMember.payments.length > 0
            ? selectedMember.payments
            : [{ amount: 0, date: new Date(), method: "cash" }],
      };
      reset(memberForForm); // 👈 This triggers setState synchronously
    }
  }, [selectedMember, reset]);

  const onSubmit = (data: MemberEditType) => {
    console.log("Updated member:", data);
    onOpenChange(false);
  };

  // 🖼️ Handle avatar change + validation
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    // Validate size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB.");
      return;
    }

    // Preview
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    // Update form value
    setValue("avatar", imageUrl as string);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-gray-700 bg-[#111827] text-white">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>

        {selectedMember ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative h-18 w-18 overflow-hidden rounded-full border-2 border-gray-600 shadow-md">
                <Image
                  src={preview || "/images/profile.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <Label htmlFor="avatar">
                  <Button
                    variant="default"
                    className="rounded-none px-4"
                    asChild
                  >
                    <span className="cursor-pointer">Upload New</span>
                  </Button>
                </Label>

                {errors.avatar && (
                  <p className="text-sm text-red-500">
                    {errors.avatar.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                className="rounded-none bg-gray-800 text-white"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{9,15}$/,
                    message: "Invalid phone number",
                  },
                })}
                className="rounded-none bg-gray-800 text-white"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2 text-white">
              <Label>Gender</Label>
              <Controller
                control={control}
                name="gender"
                rules={{ required: "Select gender" }}
                render={({ field }) => (
                  <RadioGroup
                    className="mt-2 flex flex-row gap-4"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.gender && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Payment Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETB)</Label>
              <Input
                id="amount"
                type="number"
                {...register("payments.0.amount", {
                  required: "Amount is required",
                  min: { value: 0, message: "Amount must be positive" },
                })}
                className="rounded-none bg-gray-800 text-white"
              />
              {errors.payments?.[0]?.amount && (
                <p className="text-sm text-red-500">
                  {errors.payments[0].amount.message}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Controller
                control={control}
                name="payments.0.method"
                rules={{ required: "Payment method is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-none bg-gray-800 px-3 py-2 text-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="cbe">CBE</option>
                    <option value="tele-birr">Tele-birr</option>
                    <option value="transfer">Transfer</option>
                  </select>
                )}
              />
              {errors.payments?.[0]?.method && (
                <p className="text-sm text-red-500">
                  {errors.payments[0].method.message}
                </p>
              )}
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-none text-black"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary rounded-none">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <p className="text-sm text-gray-400">No member selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
