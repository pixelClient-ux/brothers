"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Lock } from "lucide-react";
import Link from "next/link";

type ResetFormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormData>();

  const onSubmit = (data: ResetFormData) => {
    console.log("Password Reset Data:", data);
    // here you can call your API for resetting password
  };

  const password = watch("password");

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4 border p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-primary h-6 w-6" />
            <h1 className="text-xl font-semibold">GYM</h1>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6 space-y-2 text-center">
          <h2 className="text-2xl font-bold">Reset Password</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              New Password
            </Label>
            <div className="focus-within:ring-primary/60 flex w-full items-center gap-2 rounded-none border px-7 py-1 focus-within:ring-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <Input
                id="password"
                type="password"
                className="w-full border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
                placeholder="Enter new password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="focus-within:ring-primary/60 flex w-full items-center gap-2 rounded-none border px-7 py-1 focus-within:ring-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <Input
                id="confirmPassword"
                type="password"
                className="w-full border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
                placeholder="Confirm new password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer rounded-none px-5"
          >
            Confirm
          </Button>
        </form>
      </div>
    </div>
  );
}
