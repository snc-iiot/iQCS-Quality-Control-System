import { API_BASE_URL } from "@/helpers/common.helper";
import { useAtomStore } from "@/store";
import { TResponse, TSNCOverview } from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class SNCDashboardService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getSNCOverview = async ({
    start_date,
    end_date,
    defect_type,
  }: {
    start_date: string;
    end_date: string;
    defect_type: "ALL" | "P" | "S";
  }): Promise<TSNCOverview[]> => {
    try {
      const { data } = await this.get<TResponse<TSNCOverview[]>>(
        `/defects-logging/parts-summary-all-plant?start_date=${start_date}&end_date=${end_date}&defects_type=${defect_type}`
      );
      this.store.setSNCOverviewList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_SNC_OVERVIEW_ERROR", error);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };
}
