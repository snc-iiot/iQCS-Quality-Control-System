import { GET_SNC_OVERVIEW, GET_SNC_PART_DETAIL } from "@/lib/constants";
import { TSNCOverview, TSNCPartDetail } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { SNCDashboardService } from "../snc-dashboard.service";

export const useSNCOverview = () => {
  const { getSNCOverview, getSNCPartDetail } = new SNCDashboardService();

  type TGetSncOverview = {
    start_date: string;
    end_date: string;
    defect_type: "ALL" | "P" | "S";
  };

  const useGetSncOverview = ({ start_date, end_date, defect_type }: TGetSncOverview) => {
    return useQuery({
      queryKey: [GET_SNC_OVERVIEW, start_date, end_date, defect_type],
      queryFn: (): Promise<TSNCOverview[]> =>
        getSNCOverview({
          start_date,
          end_date,
          defect_type,
        }),
      refetchInterval: 20000,
    });
  };

  const useGetSncPartDetail = ({
    start_date,
    end_date,
    defect_type,
    part_id,
    process_id,
  }: TGetSncOverview & {
    part_id: string;
    process_id: string;
  }) => {
    return useQuery({
      queryKey: [GET_SNC_PART_DETAIL, start_date, end_date, defect_type, part_id, process_id],
      queryFn: (): Promise<TSNCPartDetail[]> =>
        getSNCPartDetail({
          start_date,
          end_date,
          defect_type,
          part_id,
          process_id,
        }),
      refetchInterval: 20000,
    });
  };

  return {
    useGetSncOverview,
    useGetSncPartDetail,
  };
};
