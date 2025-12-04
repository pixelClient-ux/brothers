"use client";

import login from "@/app/(api)/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export interface loginType {
  email: string;
  password: string;
}
export default function useLogin() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: loginType) => login(data),
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Somethin went wrong, please try agin");
    },
  });

  return { mutate, isPending };
}
