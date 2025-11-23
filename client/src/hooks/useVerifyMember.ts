// hooks/useVerifyMember.ts
import { verifyMember } from "@/app/(api)/verifymember";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function useVerifyMember() {
  const router = useRouter();
  const lastCode = useRef<string>("");

  return useMutation({
    mutationFn: (code: string) => {
      lastCode.current = code;
      return verifyMember(code);
    },
    onSuccess: (data) => {
      const code = data?.data?.member.memberCode || lastCode.current;
      router.replace(`/scan/${code}`);
    },
    onError: () => {
      router.replace(`/scan/${lastCode.current}`);
    },
  });
}
