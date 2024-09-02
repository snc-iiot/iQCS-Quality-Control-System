import {
  GET_DEFECT_SUMMARIES_BY_DATE,
  GET_GRAPH_SUMMARIES,
  GET_PART_SUMMARIES,
  GET_RAW_DEFECTS,
  GET_TOP_DEFECTS,
} from "@/lib/constants";
import { TCreateUpdateDefect, TDefect, TDefectSummary, TGraphSummary, TPartSummary, TTopDefect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { DefectService } from "../defect.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useDefect = () => {
  const {
    createDefect,
    getRawDefects,
    getSummaryDefectsByDate,
    updateDefect,
    deleteDefect,
    getSummaryDefectsByDateGraph,
    getTopDefects,
    getSummaryDefectsByPartGraph,
  } = new DefectService();
  const { mutateAsync: mutateCreateDefect } = useMutationWithToast(
    async (data: TCreateUpdateDefect) => await createDefect(data),
    "Defect created successfully",
    [GET_RAW_DEFECTS]
  );

  const { mutateAsync: mutateUpdateDefect } = useMutationWithToast(
    async (data: TCreateUpdateDefect) => await updateDefect(data),
    "Defect updated successfully",
    [GET_RAW_DEFECTS]
  );

  const { mutateAsync: mutateDeleteDefect } = useMutationWithToast(
    async (id: string) => await deleteDefect(id),
    "Defect deleted successfully",
    [GET_RAW_DEFECTS, GET_DEFECT_SUMMARIES_BY_DATE]
  );

  const useGetRawDefects = (start_datetime: string, end_datetime: string) => {
    return useQuery({
      queryKey: [GET_RAW_DEFECTS, start_datetime, end_datetime],
      queryFn: (): Promise<TDefect[]> => getRawDefects(start_datetime, end_datetime),
    });
  };

  const useGetSummaryDefectsByDate = (data: { date: string; mode: "daily" | "time_slot"; time_slot: string }) => {
    return useQuery({
      queryKey: [GET_DEFECT_SUMMARIES_BY_DATE, data],
      queryFn: (): Promise<TDefectSummary[]> => getSummaryDefectsByDate(data),
    });
  };

  const useGetSummaryDefectsByDateGraph = (start_date: string, end_date: string) => {
    return useQuery({
      queryKey: [GET_GRAPH_SUMMARIES, start_date, end_date],
      queryFn: (): Promise<TGraphSummary[]> => getSummaryDefectsByDateGraph(start_date, end_date),
      refetchInterval: 60000,
    });
  };

  const useGetTopDefects = (start_date: string, end_date: string, process: string, shift: string, ranking: number) => {
    return useQuery({
      queryKey: [GET_TOP_DEFECTS, start_date, end_date, process, shift],
      queryFn: (): Promise<TTopDefect[]> => getTopDefects(start_date, end_date, process, shift, ranking),
    });
  };

  const useGetSummaryDefectsByPartGraph = (start_date: string, end_date: string, process_id: string) => {
    return useQuery({
      queryKey: [GET_PART_SUMMARIES, start_date, end_date, process_id],
      queryFn: (): Promise<TPartSummary[]> => getSummaryDefectsByPartGraph(start_date, end_date, process_id),
      refetchInterval: 60000,
    });
  };

  return {
    mutateCreateDefect,
    useGetRawDefects,
    useGetSummaryDefectsByDate,
    mutateUpdateDefect,
    mutateDeleteDefect,
    useGetSummaryDefectsByDateGraph,
    useGetTopDefects,
    useGetSummaryDefectsByPartGraph,
  };
};
