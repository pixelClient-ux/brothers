import { updateAdminProfile } from "@/app/(api)/updateAdminProfile";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
interface updateDataType {
  fullName?: string;
  email?: string;
}
export function useUpdateAdminProfile() {
  const mutate = useMutation({
    mutationFn: (adminData: updateDataType) => updateAdminProfile(adminData),
    onSuccess: () => {
      toast.success("You have successfully update your personal infromation");
    },
    onError: (err) => {
      toast.error(err.message || "Somethin went wrong ,please try agin");
    },
  });
  return { mutate };
}
