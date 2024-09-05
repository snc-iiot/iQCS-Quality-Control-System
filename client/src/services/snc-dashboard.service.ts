import { API_BASE_URL } from "@/helpers/common.helper";
import { useAtomStore } from "@/store";
import { TResponse, TSNCOverview, TSNCPartDetail } from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

type TPayload = {
  start_date: string;
  end_date: string;
  defect_type: "ALL" | "P" | "S";
};

export class SNCDashboardService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getSNCOverview = async ({ start_date, end_date, defect_type }: TPayload): Promise<TSNCOverview[]> => {
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

  public getSNCPartDetail = async ({
    start_date,
    end_date,
    defect_type,
    part_id,
    process_id,
  }: TPayload & {
    part_id: string;
    process_id: string;
  }): Promise<TSNCPartDetail[]> => {
    try {
      const { data } = await this.get<TResponse<TSNCPartDetail[]>>(`/defects-logging/part-details`, {
        params: {
          start_date,
          end_date,
          defect_type,
          part_id,
          process_id,
        },
      });
      this.store.setSNCPartDetailList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_SNC_PART_DETAIL_ERROR", error);
        this.store.setSNCPartDetailList([]);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        this.store.setSNCPartDetailList([]);
        return [];
      }
    }
  };
}
