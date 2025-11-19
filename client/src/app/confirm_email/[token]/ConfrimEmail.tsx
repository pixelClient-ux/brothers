"use client";

import { useState } from "react";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import useVerifyEmailChnage from "@/hooks/useVerifyEmailChnage";
import toast from "react-hot-toast";

export default function ConfirmEmailClient({ token }: { token: string }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { mutate, isPending } = useVerifyEmailChnage();

  const handleConfirm = () => {
    mutate(token, {
      onSuccess: () => {
        setIsConfirmed(true); // ✅ Show success card
        toast.success("Email verified successfully!");
      },
      onError: () => toast.error("Error verifying email."),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-none border bg-gray-800 shadow-md">
          <CardHeader className="space-y-2 text-center">
            <div className="mb-2 flex justify-center">
              {isConfirmed ? (
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              ) : (
                <Mail className="text-primary h-12 w-12" />
              )}
            </div>

            <CardTitle className="text-xl font-semibold text-gray-300">
              {isConfirmed ? "Email Confirmed" : "Confirm Admin Email"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-center text-gray-200">
            {!isConfirmed ? (
              <p>You are about to confirm an admin email change request.</p>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <ShieldCheck className="h-10 w-10 text-green-500" />
                <p className="font-medium text-green-600">
                  The admin email has been successfully confirmed.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            {!isConfirmed && (
              <Button
                size="lg"
                onClick={handleConfirm}
                disabled={isPending}
                className="w-full rounded-none"
              >
                {isPending ? "Confirming..." : "Confirm Email"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
