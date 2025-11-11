import { updateAdminProfile } from "@/app/(api)/updateAdminProfile";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateAdminProfile() {
  const { mutate, isPending } = useMutation({
    mutationFn: (adminData: FormData) => updateAdminProfile(adminData),
    onSuccess: () => {
      toast.success("You have successfully update your personal infromation");
    },
    onError: (err) => {
      toast.error(err.message || "Somethin went wrong ,please try agin");
    },
  });
  return { mutate, isPending };
}
