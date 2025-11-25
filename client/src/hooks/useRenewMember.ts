import { renewMembership } from "@/app/(api)/renewMembership";
import { reneMemberData } from "@/components/RenewMember";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
interface RenewMemberProps {
  data: reneMemberData;
  memberId: string;
}
export default function useRenewMember() {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({ data, memberId }: RenewMemberProps) =>
      renewMembership({ data, memberId }),
    onSuccess: (data) => {
      toast.success(data.message);
      window.location.reload();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Somethin went wrong ,please try again");
    },
  });

  return { mutate, isPending, isSuccess };
}
