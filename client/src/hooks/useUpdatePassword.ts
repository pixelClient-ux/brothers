import upadtePassword from "@/app/(api)/updatePassword";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
export interface updatePasswordType {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export const useUpdatePassword = () => {
  const mutate = useMutation({
    mutationFn: (data: updatePasswordType) => upadtePassword(data),
    onSuccess: () => {
      toast.success("You have successfully updated your password");
    },
    onError: (error) => {
      toast.error(error.message || "Somethin went wrong,please try again");
    },
  });

  return { mutate };
};
