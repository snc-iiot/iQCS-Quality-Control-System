import { GET_HISTORY_UPDATE_PRICE, GET_MODELS, GET_PARTS } from "@/lib/constants";
import {
  TCreateUpdateModel,
  TCreateUpdatePart,
  TCreateUpdatePartPrice,
  THistoryUpdatePrice,
  TModel,
  TPart,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PartService } from "../part.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const usePart = () => {
  const {
    getParts,
    createPart,
    updatePart,
    deletePart,
    importExcelPart,
    getHistoryUpdatePrice,
    updatePartPrice,
    deleteUpdatePrice,
    // model
    getModels,
    createModel,
    updateModel,
    deleteModel,
  } = new PartService();

  const useGetParts = () => {
    return useQuery({
      queryKey: [GET_PARTS],
      queryFn: (): Promise<TPart[]> => getParts(),
      refetchInterval: 10000,
    });
  };

  const useGetHistoryUpdatePrice = () => {
    return useQuery({
      queryKey: [GET_HISTORY_UPDATE_PRICE],
      queryFn: (): Promise<THistoryUpdatePrice[]> => getHistoryUpdatePrice(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateUpdatePartPrice } = useMutationWithToast(
    async (data: TCreateUpdatePartPrice) => await updatePartPrice(data),
    "Part price updated successfully",
    [GET_HISTORY_UPDATE_PRICE]
  );

  const { mutateAsync: mutateDeleteUpdatePrice } = useMutationWithToast(
    async (update_price_id: string) => await deleteUpdatePrice(update_price_id),
    "Part price deleted successfully",
    [GET_HISTORY_UPDATE_PRICE]
  );

  const { mutateAsync: mutateCreatePart } = useMutationWithToast(
    async (data: TCreateUpdatePart) => await createPart(data),
    "Part created successfully",
    [GET_PARTS]
  );

  const { mutateAsync: mutateUpdatePart } = useMutationWithToast(
    async (data: TCreateUpdatePart) => await updatePart(data),
    "Part updated successfully",
    [GET_PARTS]
  );

  const { mutateAsync: mutateDeletePart } = useMutationWithToast(
    async (part_id: string) => await deletePart(part_id),
    "Part deleted successfully",
    [GET_PARTS]
  );

  const { mutateAsync: mutateImportExcelPart } = useMutationWithToast(
    async (data: TCreateUpdatePart[]) => await importExcelPart(data),
    "Part imported successfully",
    [GET_PARTS]
  );

  const useGetModels = () => {
    return useQuery({
      queryKey: [GET_MODELS],
      queryFn: (): Promise<TModel[]> => getModels(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateCreateModel } = useMutationWithToast(
    async (data: TCreateUpdateModel) => await createModel(data),
    "Model created successfully",
    [GET_MODELS]
  );

  const { mutateAsync: mutateUpdateModel } = useMutationWithToast(
    async (data: TCreateUpdateModel) => await updateModel(data),
    "Model updated successfully",
    [GET_MODELS]
  );

  const { mutateAsync: mutateDeleteModel } = useMutationWithToast(
    async (model_id: string) => await deleteModel(model_id),
    "Model deleted successfully",
    [GET_MODELS]
  );

  return {
    useGetParts,
    mutateCreatePart,
    mutateUpdatePart,
    mutateDeletePart,
    mutateImportExcelPart,
    useGetHistoryUpdatePrice,
    mutateUpdatePartPrice,
    mutateDeleteUpdatePrice,
    useGetModels,
    mutateCreateModel,
    mutateUpdateModel,
    mutateDeleteModel,
  };
};
