import forgetPassword from "@/app/(api)/forgetPasword";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useForgetPassword() {
  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) => forgetPassword(email),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "forgetPassword token sent to email,Please check your inbox",
      );
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
  return { mutate, isPending };
}
