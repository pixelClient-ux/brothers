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

export default function ConfirmEmail() {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    // TODO: Add your API call here, e.g.:
    // await axios.post("/api/admin/confirm-email", { email: "admin@example.com" });
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
              <>
                <p>
                  You are about to confirm an admin email change request. Please
                  verify that this action is authorized.
                </p>
                <div className="rounded-none border bg-gray-100 p-3 text-left">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">New Email:</span>{" "}
                    admin@example.com
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Requested by:</span> Super
                    Admin
                  </p>
                </div>
              </>
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
                className="w-full cursor-pointer rounded-none"
              >
                Confirm Email
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
