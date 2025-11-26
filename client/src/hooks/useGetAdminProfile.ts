import getAdmin from "@/app/(api)/getAdmin";
import { useQuery } from "@tanstack/react-query";

export default function useGetAdmin() {
  const { data, isError, error } = useQuery({
    queryFn: () => getAdmin(),
    queryKey: ["adminProfile"],
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isError, error };
}
