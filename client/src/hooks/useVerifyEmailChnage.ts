import verfyEmailChange from "@/app/(api)/verifyEmailchange";
import { useMutation } from "@tanstack/react-query";

export default function useVerifyEmailChnage() {
  const { mutate, isPending } = useMutation({
    mutationFn: (token: string) => verfyEmailChange(token),
  });

  return { mutate, isPending };
}
