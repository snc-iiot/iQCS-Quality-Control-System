import { GET_PRICE_RATIOS } from "@/lib/constants";
import { TCreateUpdatePriceRatio, TPriceRatio } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PriceRatioService } from "../price-ratio.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const usePriceRatio = () => {
  const { getPriceRatios, createPriceRatio, updatePriceRatio, deletePriceRatio } = new PriceRatioService();

  const useGetPriceRatios = () => {
    return useQuery({
      queryKey: [GET_PRICE_RATIOS],
      queryFn: (): Promise<TPriceRatio[]> => getPriceRatios(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateCreatePriceRatio } = useMutationWithToast(
    async (data: TCreateUpdatePriceRatio) => await createPriceRatio(data),
    "Price Ratio created successfully",
    [GET_PRICE_RATIOS]
  );

  const { mutateAsync: mutateUpdatePriceRatio } = useMutationWithToast(
    async (data: TCreateUpdatePriceRatio) => await updatePriceRatio(data),
    "Price Ratio updated successfully",
    [GET_PRICE_RATIOS]
  );

  const { mutateAsync: mutateDeletePriceRatio } = useMutationWithToast(
    async (data: string) => await deletePriceRatio(data),
    "Price Ratio deleted successfully",
    [GET_PRICE_RATIOS]
  );

  return {
    useGetPriceRatios,
    mutateCreatePriceRatio,
    mutateUpdatePriceRatio,
    mutateDeletePriceRatio,
  };
};
