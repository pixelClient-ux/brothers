"use client";

import { useForm } from "react-hook-form";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const onSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <div className="mx-auto flex h-[90vh] max-w-7xl items-center gap-10 px-12 py-10">
      <div className="relative hidden aspect-16/12 w-full md:block">
        <Image
          src="/gym/gym.png"
          alt="Logo"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="w-full space-y-6 md:basis-4/5">
        <div className="text-center">
          <h1 className="text-3xl font-bold lg:text-4xl">
            Welcome back to <br />
            <span className="text-primary">GYM-FITNESS</span>
          </h1>
          <p className="text-muted-foreground text-sm">Login to your account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start space-y-4"
        >
          <Label className="flex w-full flex-col items-start">
            Email
            <div className="focus-within:border-primary flex w-full items-center gap-2 border-b border-black">
              <Mail className="text-gray-500" size={18} />
              <Input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full rounded-none border-none bg-transparent px-2 py-2 shadow-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </Label>

          <Label className="flex w-full flex-col items-start">
            Password
            <div className="focus-within:border-primary flex w-full items-center gap-2 border-b border-black">
              <Lock className="text-gray-500" size={18} />
              <Input
                type={showPassword ? "password" : "text"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full rounded-none border-none bg-transparent px-2 py-2 shadow-none focus-visible:ring-0 focus-visible:outline-none"
              />
              {showPassword ? (
                <EyeOff
                  size={18}
                  className="cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </Label>

          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 mt-4 w-full cursor-pointer rounded-none text-white"
          >
            Login
          </Button>

          <div className="flex w-full items-center">
            <p>Don&apos;t have an account?</p>
            <Link
              href="/signup"
              className="text-blue-500 transition-colors duration-300 hover:text-blue-700"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
