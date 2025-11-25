import { createMember } from "@/app/(api)/createMember";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useCreateMember() {
  const { mutate, isPending } = useMutation({
    mutationFn: (userData: FormData) => createMember(userData),
    onSuccess: () => {
      toast.success("Member created successfully");
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Somethin went wrong ,please try again");
    },
  });

  return { mutate, isPending };
}
