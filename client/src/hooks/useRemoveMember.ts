import { removeMember } from "@/app/(api)/removeMember";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useRemoveMember() {
  const { mutate, isPending } = useMutation({
    mutationFn: (memberId: string) => removeMember(memberId),
    onSuccess: () => {
      toast.success("you have successfully removed member");
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Somthing went wrong,please try again");
    },
  });

  return { mutate, isPending };
}
