import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { MemberType } from "@/lib/memeberType";
import getMemebrDetails from "@/app/(api)/getMemberDetails";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: { memberCode: string };
}

export default async function MemberStatusCard({ params }: PageProps) {
  const { memberCode } = await params;

  let member: MemberType | null = null;
  let error: string | null = null;

  try {
    const res = await getMemebrDetails(memberCode);

    if (!res) {
      error = "Member not found";
    } else {
      member = res.data.member;
    }
  } catch (err: unknown) {
    console.error("Failed to fetch member:", err);
    if (err instanceof Error) {
      error = err.message || "Member not found";
    } else if (typeof err === "string") {
      error = err;
    } else {
      error = "Member not found";
    }
  }

  const isError = !member;

  // Determine status
  const status = member?.membership?.status || "";
  const daysLeft = member?.daysLeft ?? member?.daysLeft ?? 0;

  const isActive = status === "active";
  const isExpired = status === "expired";

  const statusColor = isActive
    ? "green-600"
    : isExpired
      ? "red-600"
      : "yellow-400";

  const StatusIcon = isActive ? CheckCircle2 : XCircle;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-sm rounded-none border border-gray-200 bg-slate-800 text-center shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2">
          <div className="relative h-24 w-24">
            <Image
              src={member?.avatar?.url || "/default-avatar.png"}
              alt={member?.fullName || "Member"}
              fill
              className="rounded-full border-2 border-gray-500 object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {member?.fullName || "Unknown Member"}
          </h2>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          {isError ? (
            <>
              <XCircle size={48} className="text-red-600" />
              <p className="text-lg font-semibold text-red-600">
                {error || "Member Not Found"}
              </p>
            </>
          ) : (
            <>
              <StatusIcon size={48} className={`text-${statusColor}`} />
              <p className={`text-lg font-semibold text-${statusColor}`}>
                {status === "active"
                  ? `Active - ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`
                  : status === "expired"
                    ? "Membership Expired"
                    : status}
              </p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button asChild className="rounded-none">
            <Link href="/scan" className="flex items-center gap-2">
              Back to Scan
              <RefreshCcw />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
