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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { MemberDataType } from "@/app/(api)/createMember";

interface MemberCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMember: MemberDataType | null;
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
    formState: { errors },
  } = useForm<MemberDataType>();

  useEffect(() => {
    if (selectedMember) {
      const memberForForm: MemberDataType = {
        ...selectedMember,
        payments:
          selectedMember.payments && selectedMember.payments.length > 0
            ? selectedMember.payments
            : [{ amount: 0, date: new Date(), method: "cash" }],
      };
      reset(memberForForm);
    }
  }, [selectedMember, reset]);

  const onSubmit = (data: MemberDataType) => {
    console.log("Updated member:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-gray-700 bg-[#111827] text-white">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>

        {selectedMember ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {/* Latest Payment Amount */}
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

            {/* Latest Payment Method */}
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
