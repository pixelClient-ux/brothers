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
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import Image from "next/image";
import { MemberType } from "@/lib/memeberType";
import { useEffect, useState } from "react";
import useUpdateMember from "@/hooks/useUpdateMember";
import { Loader2 } from "lucide-react";

interface MemberCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMember: MemberType | null;
}

export interface FormValue {
  fullName: string;
  phone: string;
  gender: "male" | "female";
  avatar: FileList | null;
  durationMonths: number;
  amount: number;
  method: "cash" | "cbe" | "tele-birr" | "transfer";
}

export default function EditMemberCard({
  open,
  onOpenChange,
  selectedMember,
}: MemberCardProps) {
  const { mutate, isPending } = useUpdateMember();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      fullName: "",
      phone: "",
      gender: "male",
      avatar: null,
      durationMonths: 1,
      amount: 0,
      method: "cash",
    },
  });

  const memberId = selectedMember?._id;
  const avatarFile = watch("avatar");

  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (selectedMember) {
      setPreview(selectedMember.avatar);
    }
  }, [avatarFile, selectedMember]);

  useEffect(() => {
    if (selectedMember) {
      const lastPayment =
        selectedMember.payments[selectedMember.payments.length - 1];
      reset({
        fullName: selectedMember.fullName,
        phone: selectedMember.phone,
        gender: selectedMember.gender,
        avatar: null,
        durationMonths: selectedMember.membership?.durationMonths || 1,
        amount: lastPayment?.amount || 0,
        method: lastPayment?.method || "cash",
      });
      setPreview(selectedMember.avatar);
    }
  }, [selectedMember, reset]);

  const onSubmit = (data: FormValue) => {
    if (!memberId) return;
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender);
    formData.append("durationMonths", data.durationMonths.toString());
    formData.append("amount", data.amount.toString());
    formData.append("method", data.method);
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    mutate(
      { data: formData, memberId },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  if (!selectedMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-md overflow-y-auto border border-gray-700 bg-[#111827] text-white">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-600 shadow-md">
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
                className="hidden"
                {...register("avatar")}
              />
              <Label htmlFor="avatar">
                <Button variant="default" className="rounded-none px-4" asChild>
                  <span className="cursor-pointer">Upload New</span>
                </Button>
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register("fullName", { required: "Full name required" })}
              className="rounded-none bg-gray-800 text-white"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone", { required: "Phone required" })}
              className="rounded-none bg-gray-800 text-white"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Controller
              control={control}
              name="gender"
              rules={{ required: "Select gender" }}
              render={({ field }) => (
                <RadioGroup
                  className="mt-2 flex gap-6"
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
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="durationMonths">Duration to extend (Months)</Label>
            <Input
              id="durationMonths"
              type="number"
              min={1}
              max={36}
              {...register("durationMonths", { required: "Duration required" })}
              className="rounded-none bg-gray-800 text-white"
            />
            {errors.durationMonths && (
              <p className="text-sm text-red-500">
                {errors.durationMonths.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount (ETB)</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { required: true, min: 0 })}
              className="rounded-none bg-gray-800 text-white"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Controller
              control={control}
              name="method"
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
          </div>

          <DialogFooter className="flex w-full justify-end gap-2 border-t border-gray-700 bg-[#111827] p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-none text-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-none"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
