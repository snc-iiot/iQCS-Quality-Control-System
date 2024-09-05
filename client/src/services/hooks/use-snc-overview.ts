import { GET_SNC_OVERVIEW } from "@/lib/constants";
import { TSNCOverview } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { SNCDashboardService } from "../snc-dashboard.service";

export const useSNCOverview = () => {
  const { getSNCOverview } = new SNCDashboardService();
  const useGetSncOverview = ({
    start_date,
    end_date,
    defect_type,
  }: {
    start_date: string;
    end_date: string;
    defect_type: "ALL" | "P" | "S";
  }) => {
    return useQuery({
      queryKey: [GET_SNC_OVERVIEW],
      queryFn: (): Promise<TSNCOverview[]> =>
        getSNCOverview({
          start_date,
          end_date,
          defect_type,
        }),
      refetchInterval: 20000,
    });
  };

  return {
    useGetSncOverview,
  };
};
