import { updateMember } from "@/app/(api)/updateMember";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdatedMemberProps {
  data: FormData;
  memberId: string;
}

export default function useUpdateMember() {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ data, memberId }: UpdatedMemberProps) =>
      updateMember({ data, memberId }),
    onSuccess: () => {
      toast.success("Member updated successfully");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong, Please try again");
    },
  });

  return { mutate, isPending };
}
