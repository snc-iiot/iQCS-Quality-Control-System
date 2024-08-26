import { GET_NG_CAUSES } from "@/lib/constants";
import { TCreateNGCause, TNGCause } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { NGCauseService } from "../ng-cause.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useNGCause = () => {
  const { getNGCauses, deleteNGCause, createNGCause, updateNGCause } = new NGCauseService();

  const useGetNGCauses = () => {
    return useQuery({
      queryKey: [GET_NG_CAUSES],
      queryFn: (): Promise<TNGCause[]> => getNGCauses(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateDeleteNGCause } = useMutationWithToast(
    async (data: string) => await deleteNGCause(data),
    "Deleting NG Cause",
    [GET_NG_CAUSES]
  );

  const { mutateAsync: mutateCreateNGCause } = useMutationWithToast(
    async (data: TCreateNGCause) => await createNGCause(data),
    "Creating NG Cause",
    [GET_NG_CAUSES]
  );

  const { mutateAsync: mutateUpdateNGCause } = useMutationWithToast(
    async (data: TCreateNGCause) => await updateNGCause(data),
    "Updating NG Cause",
    [GET_NG_CAUSES]
  );

  return {
    useGetNGCauses,
    mutateDeleteNGCause,
    mutateCreateNGCause,
    mutateUpdateNGCause,
  };
};
