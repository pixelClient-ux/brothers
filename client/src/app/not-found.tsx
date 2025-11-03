"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-[90vh] items-center justify-center bg-black text-white">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-lg text-gray-400">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link href="/">
          <Button className="rounded-none px-5">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
