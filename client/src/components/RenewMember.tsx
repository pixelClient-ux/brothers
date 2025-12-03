"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { useEffect } from "react";
import useRenewMember from "@/hooks/useRenewMember";
import { Loader2 } from "lucide-react";

export interface MembershipRenewProps {
  id: string;
  fullName: string;
  avatar: string;
  phone: string;
  status: string;
  membershipPeriod: string;
}
export interface reneMemberData {
  membershipPeriod: string;
  amount: string;
  paymentMethod: "cash" | "cbe" | "telebirr" | "transfer";
}

interface RenewMembershipProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MembershipRenewProps | null;
}

export default function RenewMembership({
  open,
  onOpenChange,
  member,
}: RenewMembershipProps) {
  const { mutate, isPending } = useRenewMember();
  const memberId = member?.id;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<reneMemberData>({
    defaultValues: {
      membershipPeriod: "",
      paymentMethod: "cash",
      amount: "",
    },
  });

  useEffect(() => {
    if (open && member) {
      reset({
        membershipPeriod: "",
        paymentMethod: "cash",
        amount: "",
      });
    }
  }, [open, member, reset]);

  function submitHandler(data: reneMemberData) {
    if (!memberId) return;

    mutate(
      { data, memberId },
      {
        onSuccess: () => {
          // Only close dialog when API succeeds
          onOpenChange(false);
        },
        onError: (err) => {
          // Optional: show toast or log error, keep dialog open
          console.error("Failed to renew membership:", err);
        },
      },
    );
  }

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-gray-700 bg-[#1C1F26] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Renew Membership
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Renew <b className="text-primary">{member.fullName}</b>’s gym
            membership.
          </p>
        </DialogHeader>

        <div className="mt-2 flex items-center gap-3 rounded-md bg-gray-800/40 p-3">
          <Image
            src={member.avatar || "/images/profile.png"}
            alt={member.fullName}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{member.fullName}</p>
            <p className="text-sm text-gray-400">{member.phone}</p>
            <p
              className={`text-xs ${
                member.status === "Active" ? "text-green-400" : "text-red-400"
              }`}
            >
              Status: {member.status}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="mt-4 space-y-4">
          <div className="space-y-3">
            <Label>Renew membership</Label>
            <Controller
              name="membershipPeriod"
              control={control}
              rules={{ required: "Plan is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full rounded-none border-gray-700 bg-gray-900 px-4 font-medium text-white">
                    <SelectValue placeholder="Select your plan" />
                  </SelectTrigger>

                  <SelectContent className="border-gray-700 bg-gray-900 text-white">
                    <SelectItem value="1">
                      1 Month —{" "}
                      <span className="font-semibold text-green-400">
                        1600 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="2">
                      2 Months —{" "}
                      <span className="font-semibold text-green-400">
                        3000 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="3">
                      3 Months —{" "}
                      <span className="font-semibold text-green-400">
                        4200 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="4">
                      4 Months —{" "}
                      <span className="font-semibold text-green-400">
                        5200 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="5">
                      5 Months —{" "}
                      <span className="font-semibold text-green-400">
                        6000 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="6">
                      6 Months —{" "}
                      <span className="font-semibold text-green-400">
                        7000 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="7">
                      7 Months —{" "}
                      <span className="font-semibold text-green-400">
                        7800 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="8">
                      8 Months —{" "}
                      <span className="font-semibold text-green-400">
                        8500 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="9">
                      9 Months —{" "}
                      <span className="font-semibold text-green-400">
                        9000 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="10">
                      10 Months —{" "}
                      <span className="font-semibold text-green-400">
                        9500 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="11">
                      11 Months —{" "}
                      <span className="font-semibold text-green-400">
                        10000 ETB
                      </span>
                    </SelectItem>
                    <SelectItem value="12">
                      12 Months —{" "}
                      <span className="font-semibold text-green-400">
                        11000 ETB
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.membershipPeriod && (
              <p className="mt-1 text-xs text-red-400">
                {errors.membershipPeriod.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Payment Method</Label>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: "Payment method is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full rounded-none border-gray-700 bg-gray-900 px-4">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-900 text-white">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cbe">CBE</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                    <SelectItem value="telebirr">TeleBirr</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMethod && (
              <p className="mt-1 text-xs text-red-400">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <Label>Amount (ETB)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              {...register("amount", { required: "Amount required" })}
              className="w-1/2 rounded-none border-gray-700 bg-gray-900 px-4"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-400">
                {errors.amount.message}
              </p>
            )}
          </div>

          <DialogFooter>
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
                  Renewing...
                </>
              ) : (
                "Renew Membership"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
