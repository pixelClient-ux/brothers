// components/home/Hero.tsx
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
import { ArrowUpRight, Loader2, Plus, Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useCreateMember from "@/hooks/useCreateMember";
import { useDashboardStats } from "@/hooks/useGetdashboardStat";
import DashBoardSkeloton from "@/app/(dashboard)/loading";
import useGenerateDashboardReport from "@/hooks/useGeneratedadhboardReport";

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
  const { mutate: reportMuatet } = useGenerateDashboardReport();
  const [open, setOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [filter, setFilter] = useState("30");

  const { data: stats, isLoading } = useDashboardStats({ range: filter });

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

  // YOUR ORIGINAL onSubmit — NO CHANGE
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

  const handleExport = () => {
    reportMuatet.mutate({ range: filter });
  };

  if (isLoading) return <DashBoardSkeloton />;
  // Defensive: if no data available, show a professional empty state
  if (!stats || !stats.data) {
    return (
      <div className="w-full bg-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Dashboard Unavailable
            </h2>
            <p className="mt-4 text-gray-400">
              We could not load dashboard statistics right now. Try refreshing
              the page or check your network connection. If the problem
              persists, add some members to the system to populate the
              dashboard.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                className="bg-primary rounded-none"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
              <Button
                className="rounded-none"
                onClick={() => (window.location.href = "/(dashboard)/members")}
              >
                Add Members
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusData = [
    { name: "Active", value: stats.data.status.active },
    { name: "Expired", value: stats.data.status.expired },
    { name: "Inactive", value: stats.data.status.inactive },
  ];

  const genderData = [
    { name: "Male", value: stats.data.gender.male },
    { name: "Female", value: stats.data.gender.female },
    { name: "Other", value: stats.data.gender.other },
  ];

  // Compute percent changes where we have previous-period values (server provides them when `range` is numeric)
  const calcPercent = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const newMembersChange =
    stats.data.newMembersPrevious !== undefined
      ? calcPercent(stats.data.newMembers, stats.data.newMembersPrevious)
      : null;

  const revenueChange =
    stats.data.totalRevenuePrevious !== undefined
      ? calcPercent(stats.data.totalRevenue, stats.data.totalRevenuePrevious)
      : null;

  const statsCards = [
    {
      title: "Total Members",
      value: stats.data.totalMembers.toLocaleString(),
      // Show percentage of active members instead of a historical change where not available
      change: `${Math.round((stats.data.activeMembers / Math.max(1, stats.data.totalMembers)) * 100)}% Active`,
      trend: stats.data.activeMembers >= 0 ? "up" : "neutral",
      note: "All time",
    },
    {
      title: "Active Memberships",
      value: stats.data.activeMembers.toLocaleString(),
      change: `${Math.round((stats.data.activeMembers / Math.max(1, stats.data.totalMembers)) * 100)}% of members`,
      trend: "up",
      note: "Currently active",
    },
    {
      title: "New Members",
      value: stats.data.newMembers,
      change:
        newMembersChange !== null
          ? `${newMembersChange > 0 ? "+" : ""}${newMembersChange.toFixed(1)}%`
          : "-",
      trend:
        newMembersChange !== null
          ? newMembersChange >= 0
            ? "up"
            : "down"
          : "neutral",
      note: `Last ${filter === "all" ? "year" : filter + " days"}`,
    },
    {
      title: "Total Revenue",
      value: `$${stats.data.totalRevenue.toLocaleString()}`,
      change:
        revenueChange !== null
          ? `${revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(1)}%`
          : "-",
      trend:
        revenueChange !== null
          ? revenueChange >= 0
            ? "up"
            : "down"
          : "neutral",
      note: `Last ${filter === "all" ? "year" : filter + " days"}`,
    },
  ];

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
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px] rounded-none text-white">
                  <SelectValue className="placeholder:text-white" />
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
                    value="365"
                  >
                    This Year
                  </SelectItem>
                  <SelectItem
                    className="rounded-none focus:bg-slate-300"
                    value="all"
                  >
                    All Time
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleExport}
                className="bg-primary flex items-center gap-2 rounded-none text-white"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>

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
                    {/* YOUR FULL FORM — UNTOUCHED */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white">
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
                            value: /^(?:\+2519\d{8}|09\d{8})$/,
                            message: "Invalid Ethiopian number",
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
                        rules={{ required: "Avatar is required" }}
                        render={({ field }) => (
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="file:hover:bg-primary/80 w-fit rounded-none text-white file:mr-2 file:rounded-none file:px-3 file:py-1 file:text-white"
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
                            Chosen avatar
                          </div>
                          <Image
                            src={avatarPreview}
                            alt="Preview"
                            width={20}
                            height={20}
                            className="h-18 w-18 rounded-full object-cover"
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
                            required: "Required",
                            valueAsNumber: true,
                            min: { value: 0, message: "≥ 0" },
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
                          rules={{ required: "Select method" }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="rounded-none">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="rounded-none">
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="cbe">CBE</SelectItem>
                                <SelectItem value="tele-birr">
                                  Tele-Birr
                                </SelectItem>
                                <SelectItem value="transfer">
                                  Transfer
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
                        rules={{ required: "Select duration" }}
                        render={({ field }) => (
                          <Select
                            value={field.value} // keep string
                            onValueChange={field.onChange} // keep string
                          >
                            <SelectTrigger className="rounded-none">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                              {[...Array(12)].map((_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={(i + 1).toString()}
                                >
                                  {i + 1} Month{i > 0 ? "s" : ""}
                                </SelectItem>
                              ))}
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((item, idx) => (
              <div
                key={idx}
                className="rounded-none bg-[#1C1F26] p-6 shadow-lg transition-all duration-300 hover:bg-[#242830]"
              >
                <h3 className="mb-2 text-sm text-gray-400">{item.title}</h3>
                <p className="mb-2 text-3xl font-bold text-white">
                  {item.value}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-green-400">
                    {item.change}
                  </span>
                  <span className="text-xs text-gray-500">• {item.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Line Chart */}
            <div className="rounded-lg bg-[#1C1F26] p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-white">
                New Members Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats!.data.monthlyMembers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tickFormatter={(v) =>
                      new Date(v + "-01").toLocaleString("default", {
                        month: "short",
                      })
                    }
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1C1F26",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#E5E7EB" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--chart-2)"
                    strokeWidth={3}
                    dot={{ fill: "var(--chart-2)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="rounded-lg bg-[#1C1F26] p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Revenue by Month
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats!.data.monthlyMembers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tickFormatter={(v) =>
                      new Date(v + "-01").toLocaleString("default", {
                        month: "short",
                      })
                    }
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1C1F26",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#E5E7EB" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status Pie */}
            <div className="rounded-lg bg-[#1C1F26] p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Membership Status
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
                    dataKey="value"
                  >
                    {statusData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={`var(--chart-${i + 3})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1C1F26",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Pie */}
            <div className="rounded-lg bg-[#1C1F26] p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Gender Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
                    dataKey="value"
                  >
                    {genderData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={`var(--chart-${i + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1C1F26",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
