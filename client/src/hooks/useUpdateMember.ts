import { updateMember } from "@/app/(api)/updateMember";
import { EditMemberData } from "@/components/EditMemberCard";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
interface updatedMemberProps {
  data: EditMemberData;
  memberId: string;
}
export default function useUpdateMember() {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ data, memberId }: updatedMemberProps) =>
      updateMember({ data, memberId }),
    onSuccess: () => {
      toast.success("Member updated successfully");
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong, Please try agin");
    },
  });

  return { mutate, isPending };
}
