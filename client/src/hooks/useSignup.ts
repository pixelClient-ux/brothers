import signUp from "@/app/(api)/signup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export interface signUpType {
  fullName: string;
  email: string;
  password: string;
  confirmPasword: string;
}
export default function useSignup() {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: signUpType) => signUp(data),
    onSuccess: () => {
      toast.success("You have successfully created account");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Somethin went wrong, please try agin");
    },
  });

  return { mutate };
}
