import { logout } from "@/app/(api)/logout";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function useLogout() {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      toast.error("Somethin went wrong");
    },
  });

  return { mutate };
}
