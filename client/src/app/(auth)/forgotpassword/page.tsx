"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useForgotPassword from "@/hooks/useForgetPassword";
import { Dumbbell, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
};

export default function ForgetPassword() {
  const { mutate: forgetPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    forgetPassword(data.email);
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 border p-8 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-primary h-6 w-6" />
            <h1 className="text-xl font-semibold">GYM</h1>
          </div>
        </div>

        <div className="mb-6 space-y-2 text-center">
          <h2 className="text-2xl font-bold">Forgot Password?</h2>
          <p className="text-sm text-gray-500">
            Enter your email address and we’ll send you reset instructions.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>

          <div className="focus-within:ring-primary/60 flex w-full items-center gap-2 rounded-md border px-3 py-1 focus-within:ring-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              disabled={isPending}
            />
          </div>

          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer rounded-none px-5"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </span>
          ) : (
            "Confirm"
          )}
        </Button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}
