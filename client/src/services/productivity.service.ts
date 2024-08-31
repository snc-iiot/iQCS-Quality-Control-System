import { API_BASE_URL, calculateDateTime } from "@/helpers/common.helper";
import { useAtomStore } from "@/store";
import { TCreateUpdateProductivity, TProductivity, TProductivitySummary, TResponse } from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class ProductivityService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public createProductivity = async (data: TCreateUpdateProductivity): Promise<TResponse<unknown>> => {
    try {
      const { data: res } = await this.post<TResponse<unknown>>("/productivity-logging", data);
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_PRODUCTIVITY_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create Productivity",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create Productivity",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updateProductivity = async (data: TCreateUpdateProductivity): Promise<TResponse<unknown>> => {
    try {
      const { data: res } = await this.put<TResponse<unknown>>(`/productivity-logging`, data);
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_PRODUCTIVITY_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update Productivity",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update Productivity",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deleteProductivity = async (prod_log_id: string): Promise<TResponse<unknown>> => {
    try {
      const { data: res } = await this.delete<TResponse<unknown>>(`/productivity-logging/?prod_log_id=${prod_log_id}`);
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_PRODUCTIVITY_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete Productivity",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete Productivity",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public getRawTProductivitys = async (start_datetime: string, end_datetime: string): Promise<TProductivity[]> => {
    try {
      const { data: res } = await this.get<TResponse<TProductivity[]>>(
        `/productivity-logging/raw-data-by-datetime-range?start_datetime=${start_datetime}&end_datetime=${end_datetime}`
      );
      this.store.setProductivityList(res?.data || []);
      return res?.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_PRODUCTIVITYS_ERROR", error);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  private buildUrl = (req: { date: string; mode: "daily" | "time_slot"; time_slot: string }) => {
    const { start: start_datetime, end: end_datetime } = calculateDateTime(req?.date, req?.time_slot);

    if (req.mode === "daily") {
      return `/productivity-logging/summary-by-date?date=${req?.date}`;
    } else {
      return `/productivity-logging/summary-by-datetime-range?start_datetime=${start_datetime}&end_datetime=${end_datetime}`;
    }
  };

  public getSummaryProductivitysByDate = async (req: {
    date: string;
    mode: "daily" | "time_slot";
    time_slot: string;
  }) => {
    try {
      const { data: res } = await this.get<TResponse<TProductivitySummary[]>>(this.buildUrl(req));
      /* The line `// this.store.setDefectSummaryList(res?.data || []);` is a comment in the code. It
      seems like it is a placeholder or a reminder for setting the `defectSummaryList` in the store
      with the data received from the API response `res?.data`. */
      this.store.setProductivitySummaryList(res?.data || []);
      return res?.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_SUMMARY_PRODUCTIVITYS_ERROR", error);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };
}
