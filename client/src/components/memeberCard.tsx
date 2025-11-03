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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface Member {
  id?: string;
  fullName?: string;
  phone?: string;
  gender?: string;
  amount?: string;
  cash?: string;
  isActive?: boolean;
}

interface MemberCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMember: Member | null;
}

export default function MemberCard({
  open,
  onOpenChange,
  selectedMember,
}: MemberCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<Member>({
    defaultValues: {
      fullName: "",
      phone: "",
      gender: "",
      amount: "",
      cash: "",
      isActive: false,
    },
  });

  useEffect(() => {
    if (selectedMember) reset(selectedMember);
  }, [selectedMember, reset]);

  const onSubmit = (data: Member) => {
    console.log(data);
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
            <div className="space-y-3">
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
            <div className="space-y-3">
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
            <div className="space-y-3 text-white">
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

            <div className="space-y-3">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0, message: "Amount must be positive" },
                })}
                className="rounded-none bg-gray-800 text-white"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* Cash */}
            <div className="space-y-3">
              <Label htmlFor="cash">Paymenth Method</Label>
              <Input
                id="cash"
                type="number"
                {...register("cash", {
                  required: "Cash amount is required",
                  min: { value: 0, message: "Cash must be positive" },
                })}
                className="rounded-none bg-gray-800 text-white"
              />
              {errors.cash && (
                <p className="text-sm text-red-500">{errors.cash.message}</p>
              )}
            </div>

            <div>
              <div className="space-y-3">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("isActive", value === "true")
                  }
                  defaultValue={selectedMember?.isActive ? "true" : "false"}
                >
                  <SelectTrigger className="w-full rounded-none border border-gray-700 bg-gray-800 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
