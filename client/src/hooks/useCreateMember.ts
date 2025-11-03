import { createMember, MemberDataType } from "@/app/(api)/createMember";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useCreateMember() {
  const mutate = useMutation({
    mutationFn: (userData: MemberDataType) => createMember(userData),
    onSuccess: () => {
      toast.success("Member created successfully");
    },
    onError: () => {
      toast.error("Somethin went wrong, please try agin");
    },
  });

  return { mutate };
}
