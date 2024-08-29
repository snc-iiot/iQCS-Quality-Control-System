import { GET_PROCESS } from "@/lib/constants";
import { TCreateUpdateProcess, TProcess } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ProcessService } from "../process.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useProcess = () => {
  const { getProcess, createProcess, updateProcess, deleteProcess } = new ProcessService();

  const useGetProcess = () => {
    return useQuery({
      queryKey: [GET_PROCESS],
      queryFn: (): Promise<TProcess[]> => getProcess(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateCreateProcess } = useMutationWithToast(
    async (data: TCreateUpdateProcess) => await createProcess(data),
    "Process created successfully",
    [GET_PROCESS]
  );

  const { mutateAsync: mutateUpdateProcess } = useMutationWithToast(
    async (data: TCreateUpdateProcess) => await updateProcess(data),
    "Process updated successfully",
    [GET_PROCESS]
  );

  const { mutateAsync: mutateDeleteProcess } = useMutationWithToast(
    async (Process_id: string) => await deleteProcess(Process_id),
    "Process deleted successfully",
    [GET_PROCESS]
  );

  return {
    useGetProcess,
    mutateCreateProcess,
    mutateUpdateProcess,
    mutateDeleteProcess,
  };
};
