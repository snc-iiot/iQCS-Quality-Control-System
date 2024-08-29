import { GET_MACHINES } from "@/lib/constants";
import { TCreateUpdateMachine, TMachine } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { MachineService } from "../machine.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useMachine = () => {
  const { getMachines, createMachine, updateMachine, deleteMachine } = new MachineService();

  const useGetMachines = () => {
    return useQuery({
      queryKey: [GET_MACHINES],
      queryFn: (): Promise<TMachine[]> => getMachines(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateDeleteMachine } = useMutationWithToast(
    async (data: string) => await deleteMachine(data),
    "Deleting Machine",
    [GET_MACHINES]
  );

  const { mutateAsync: mutateCreateMachine } = useMutationWithToast(
    async (data: TCreateUpdateMachine) => await createMachine(data),
    "Creating Machine",
    [GET_MACHINES]
  );

  const { mutateAsync: mutateUpdateMachine } = useMutationWithToast(
    async (data: TCreateUpdateMachine) => await updateMachine(data),
    "Updating Machine",
    [GET_MACHINES]
  );

  return {
    useGetMachines,
    mutateDeleteMachine,
    mutateCreateMachine,
    mutateUpdateMachine,
  };
};
