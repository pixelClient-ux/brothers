"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { useUpdateAdminProfile } from "@/hooks/useUpdateAdminProfile";
import { Loader2 } from "lucide-react";

type PersonalInfoForm = {
  fullName: string;
  email: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function Settings() {
  const { mutate, isPending } = useUpdateAdminProfile();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors },
  } = useForm<PersonalInfoForm>({
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfileImage(URL.createObjectURL(file)); // preview
    }
  };

  const onPersonalInfoSubmit = (data: PersonalInfoForm) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    if (profileFile) formData.append("avatar", profileFile);
    mutate(formData);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    console.log("Password Change Submitted:", data);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 bg-slate-900 px-5 py-6 text-white">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-300">Update your account information</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-300">
          <Image
            src={profileImage || "/gym/profile.png"}
            alt="profile"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="profile-upload"
            className="bg-primary cursor-pointer rounded px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            Upload New
          </label>
          <Input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Personal Information</h2>
        <p className="text-gray-300">Update your personal information</p>

        <form
          className="space-y-4"
          onSubmit={handleInfoSubmit(onPersonalInfoSubmit)}
        >
          <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
            <div className="flex-1 space-y-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...registerInfo("fullName", {
                  required: "Full Name is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                className="rounded-none"
              />
              {infoErrors.fullName && (
                <p className="text-sm text-red-500">
                  {infoErrors.fullName.message}
                </p>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...registerInfo("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="rounded-none"
              />
              {infoErrors.email && (
                <p className="text-sm text-red-500">
                  {infoErrors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary flex items-center justify-center gap-2 rounded-none"
            >
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              )}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Change Password</h2>
        <p className="text-gray-300">
          Update your password regularly for security
        </p>

        <form
          className="space-y-4"
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
        >
          <div className="space-y-3">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...registerPassword("currentPassword", {
                required: "Current password is required",
              })}
              className="rounded-none"
            />
            {passwordErrors.currentPassword && (
              <p className="text-sm text-red-500">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 space-y-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="rounded-none"
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerPassword("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (val) =>
                    val === watch("newPassword") || "Passwords do not match",
                })}
                className="rounded-none"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button type="submit" className="bg-primary rounded-none">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
