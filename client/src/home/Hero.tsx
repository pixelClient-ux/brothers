"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
  MoveRightIcon,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import HeroSkeleton from "@/components/HeroLoadingskeleton";
import useCreateMember from "@/hooks/useCreateMember";

export type MemberPayload = {
  fullName: string;
  phone: string;
  gender: "male" | "female" | "other";
  avatar: string;
  payments: number;
  method: string;
  durationMonths: number;
};

export default function Hero() {
  const { mutate, isPending } = useCreateMember();
  const [open, setOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>();

  type FormValues = {
    fullName: string;
    phone: string;
    gender?: "male" | "female" | "other";
    avatar?: FileList;
    amount?: number;
    method?: "cash" | "cbe" | "tele-birr" | "transfer";
    durationMonths: string;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      amount: undefined,
      method: undefined,
      gender: undefined,
      durationMonths: "1",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender || "");
    formData.append("amount", String(data.amount || 0));
    formData.append("method", data.method || "");
    formData.append("durationMonths", data.durationMonths);
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    mutate(formData, {
      onSuccess: () => {
        reset();
        setAvatarPreview(undefined);
        setOpen(false);
      },
    });
  };

  const stats = [
    {
      title: "Total Members",
      value: "1,240",
      change: "+12.4%",
      trend: "up",
      note: "Past 30 Days",
    },
    {
      title: "Active Memberships",
      value: "1,050",
      change: "+8.1%",
      trend: "up",
      note: "Currently Active",
    },
    {
      title: "New Members",
      value: "95",
      change: "+15.2%",
      trend: "up",
      note: "This Month",
    },
    {
      title: "Total Revenue",
      value: "$18,540.00",
      change: "+25.3%",
      trend: "up",
      note: "Past 30 Days",
    },
  ];

  if (stats.length === 0) return <HeroSkeleton />;

  return (
    <div className="w-full bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 md:flex-row lg:justify-between">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-center md:text-start">
                  <h1 className="text-2xl font-bold text-white">
                    Welcome back,
                  </h1>
                  <h2 className="text-primary text-2xl font-medium">
                    GYM-FITNESS
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  This is the overview of you
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-[180px] rounded-none text-white">
                  <SelectValue
                    placeholder="Sort By:"
                    className="placeholder:text-white"
                  />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-slate-900 text-white">
                  <SelectItem
                    className="rounded-none focus:bg-slate-300"
                    value="7"
                  >
                    Last 7 days
                  </SelectItem>
                  <SelectItem
                    className="rounded-none focus:bg-slate-300"
                    value="30"
                  >
                    Last 30 days
                  </SelectItem>
                  <SelectItem
                    className="rounded-none focus:bg-slate-300"
                    value="90"
                  >
                    Last 90 days
                  </SelectItem>
                  <SelectItem
                    className="rounded-none focus:bg-slate-300"
                    value="all"
                  >
                    All Time
                  </SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button className="bg-primary flex items-center gap-2 rounded-none text-white">
                    <Plus /> Add New
                  </Button>
                </SheetTrigger>

                <SheetContent className="h-full w-full max-w-3xl overflow-y-auto bg-gray-900 px-4">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-white">
                      Add New Member
                    </SheetTitle>
                    <SheetDescription>
                      Fill in all details to add a new member to the gym.
                    </SheetDescription>
                  </SheetHeader>

                  <form
                    className="mt-4 space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="fullName " className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        {...register("fullName", {
                          required: "Full name is required",
                          minLength: {
                            value: 2,
                            message: "Full name must be at least 2 characters",
                          },
                        })}
                        className="rounded-none"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9\-\+\s()]{7,20}$/,
                            message: "Enter a valid phone number",
                          },
                        })}
                        type="tel"
                        className="rounded-none"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="text-white">
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

                    <div className="space-y-2 text-white">
                      <Label htmlFor="avatar">Avatar</Label>
                      <Controller
                        control={control}
                        name="avatar"
                        rules={{
                          required: "Avatar is required",
                          validate: (files) =>
                            (files && (files as FileList).length > 0) ||
                            "Avatar is required",
                        }}
                        render={({ field }) => (
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="file:hover:bg-primary/80 w-fit rounded-none text-white file:mr-2 file:rounded-none file:px-3 file:py-1 file:text-white placeholder:text-white"
                            onChange={(e) => {
                              field.onChange(
                                (e.target as HTMLInputElement).files,
                              );
                              handleAvatarChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                              );
                            }}
                          />
                        )}
                      />

                      {!avatarPreview && errors.avatar && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.avatar.message}
                        </p>
                      )}

                      {avatarPreview && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-white">
                            The chosen avatar is{" "}
                            <MoveRightIcon className="text-primary" />
                          </div>
                          <Image
                            src={avatarPreview}
                            alt="Avatar Preview"
                            width={20}
                            height={20}
                            className="mt-2 h-18 w-18 rounded-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmount">Payment Amount</Label>
                        <Input
                          id="paymentAmount"
                          {...register("amount", {
                            required: "Payment amount is required",
                            valueAsNumber: true,
                            min: { value: 0, message: "Amount must be >= 0" },
                          })}
                          type="number"
                          min={0}
                          className="rounded-none"
                        />
                        {errors.amount && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.amount.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Controller
                          control={control}
                          name="method"
                          rules={{ required: "Select a payment method" }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="rounded-none">
                                <SelectValue placeholder="Select Method" />
                              </SelectTrigger>
                              <SelectContent className="rounded-none">
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="cbe">CBE</SelectItem>
                                <SelectItem value="tele-birr">
                                  Tele-Birr
                                </SelectItem>
                                <SelectItem value="transfer">
                                  Bank Transfer
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.method && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.method.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-white">
                      <Label>Membership Duration</Label>
                      <Controller
                        control={control}
                        name="durationMonths"
                        rules={{ required: "Select membership period" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={(v) => field.onChange(Number(v))}
                            value={field.value}
                          >
                            <SelectTrigger className="rounded-none">
                              <SelectValue placeholder="Select Duration" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                              <SelectItem value="1">1 Month</SelectItem>
                              <SelectItem value="2">2 Months</SelectItem>
                              <SelectItem value="3">3 Months</SelectItem>
                              <SelectItem value="4">4 Months</SelectItem>
                              <SelectItem value="5">5 Months</SelectItem>
                              <SelectItem value="6">6 Months</SelectItem>
                              <SelectItem value="7">7 Months</SelectItem>
                              <SelectItem value="8">8 Months</SelectItem>
                              <SelectItem value="9">9 Months</SelectItem>
                              <SelectItem value="10">10 Months</SelectItem>
                              <SelectItem value="11">11 Months</SelectItem>
                              <SelectItem value="12">12 Months</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.durationMonths && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.durationMonths.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-primary my-5 flex w-full items-center justify-center rounded-none text-white"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Member"
                      )}
                    </Button>
                  </form>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="rounded-none bg-[#1C1F26] p-6 shadow-lg transition-all duration-300 hover:bg-[#242830]"
              >
                <h3 className="mb-2 text-sm text-gray-400">{item.title}</h3>
                <p className="mb-2 text-3xl font-bold text-white">
                  {item.value}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  {item.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-400" />
                  )}
                  <span
                    className={
                      item.trend === "up"
                        ? "font-medium text-green-400"
                        : "font-medium text-red-400"
                    }
                  >
                    {item.change}
                  </span>
                  <span className="text-xs text-gray-500">• {item.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
