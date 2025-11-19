import resetPassword from "@/app/(api)/resetPassword";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
export interface ResetPasswordType {
  password: string;
  passwordConfirm: string;
  token: string;
}

export default function useResetPassword() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ResetPasswordType) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password has been reset successfully");
      router.push("/login");
    },
    onError: () => {
      toast.error("Something went wrong, please try again");
    },
  });
  return { mutate, isPending };
}
