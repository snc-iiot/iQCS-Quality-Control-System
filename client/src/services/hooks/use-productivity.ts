import { GET_PRODUCTIVITY_SUMMARIES_BY_DATE, GET_RAW_PRODUCTIVITYS } from "@/lib/constants";
import { TCreateUpdateProductivity, TProductivity, TProductivitySummary } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ProductivityService } from "../productivity.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useProductivity = () => {
  const {
    createProductivity,
    updateProductivity,
    deleteProductivity,
    getRawTProductivitys,
    getSummaryProductivitysByDate,
  } = new ProductivityService();
  const { mutateAsync: mutateCreateProductivity } = useMutationWithToast(
    async (data: TCreateUpdateProductivity) => await createProductivity(data),
    "Productivity created successfully",
    [GET_RAW_PRODUCTIVITYS]
  );

  const { mutateAsync: mutateUpdateProductivity } = useMutationWithToast(
    async (data: TCreateUpdateProductivity) => await updateProductivity(data),
    "Productivity updated successfully",
    [GET_RAW_PRODUCTIVITYS]
  );

  const { mutateAsync: mutateDeleteProductivity } = useMutationWithToast(
    async (id: string) => await deleteProductivity(id),
    "Productivity deleted successfully",
    [GET_RAW_PRODUCTIVITYS, GET_PRODUCTIVITY_SUMMARIES_BY_DATE]
  );

  const useGetRawProductivitys = (start_datetime: string, end_datetime: string) => {
    return useQuery({
      queryKey: [GET_RAW_PRODUCTIVITYS, start_datetime, end_datetime],
      queryFn: (): Promise<TProductivity[]> => getRawTProductivitys(start_datetime, end_datetime),
    });
  };

  const useGetSummaryProductivitysByDate = (data: { date: string; mode: "daily" | "time_slot"; time_slot: string }) => {
    return useQuery({
      queryKey: [GET_PRODUCTIVITY_SUMMARIES_BY_DATE, data],
      queryFn: (): Promise<TProductivitySummary[]> => getSummaryProductivitysByDate(data),
    });
  };

  return {
    mutateCreateProductivity,
    mutateUpdateProductivity,
    mutateDeleteProductivity,
    useGetRawProductivitys,
    useGetSummaryProductivitysByDate,
  };
};
