import { API_BASE_URL, calculateDateTime } from "@/helpers/common.helper";
import { useAtomStore } from "@/store";
import {
  TCreateUpdateDefect,
  TCreateUpdateDefectMultiple,
  TDefect,
  TDefectSummary,
  TGraphSummary,
  TModelSummary,
  TPartSummary,
  TResponse,
  TTopDefect,
} from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class DefectService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public createDefect = async (data: TCreateUpdateDefect): Promise<TResponse<unknown>> => {
    try {
      const { data: res } = await this.post<TResponse<unknown>>("/defects-logging", data);
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_DEFECT_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create defect",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create defect",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public createDefectMultiple = async (data: TCreateUpdateDefectMultiple): Promise<TResponse<unknown>> => {
    try {
      const { data: res } = await this.post<TResponse<unknown>>("/defects-logging/more-defects", data);
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_DEFECT_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create defect",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create defect",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updateDefect = async (data: TCreateUpdateDefect): Promise<TResponse<unknown>> => {
    try {
      const { data: res } = await this.put<TResponse<unknown>>(`/defects-logging`, {
        ...data,
        image: data?.image || null,
      });
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_DEFECT_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update defect",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update defect",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deleteDefect = async (id: string): Promise<TResponse<unknown>> => {
    try {
      const { data: res } = await this.delete<TResponse<unknown>>(`/defects-logging?defects_log_id=${id}`);
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_DEFECT_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete defect",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete defect",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public getRawDefects = async (start_datetime: string, end_datetime: string): Promise<TDefect[]> => {
    try {
      const { data: res } = await this.get<TResponse<TDefect[]>>(
        `/defects-logging/raw-data-by-datetime-range?start_datetime=${start_datetime}&end_datetime=${end_datetime}`
      );
      this.store.setDefectList(res?.data || []);
      return res?.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_DEFECTS_ERROR", error);
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
      return `/defects-logging/summary-by-date?date=${req?.date}`;
    } else {
      return `/productivity-logging/summary-by-datetime-range?start_datetime=${start_datetime}&end_datetime=${end_datetime}`;
    }
  };

  public getSummaryDefectsByDate = async (req: { date: string; mode: "daily" | "time_slot"; time_slot: string }) => {
    try {
      const { data: res } = await this.get<TResponse<TDefectSummary[]>>(this.buildUrl(req));
      this.store.setDefectSummaryList(res?.data || []);
      return res?.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_SUMMARY_DEFECTS_ERROR", error);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  public getSummaryDefectsByDateGraph = async (
    start_date: string,
    end_date: string,
    defects_type: "ALL" | "P" | "S"
  ): Promise<TGraphSummary[]> => {
    try {
      const { data: res } = await this.get<TResponse<TGraphSummary[]>>(
        `/defects-logging/graph-summary-by-date-range?start_date=${start_date}&end_date=${end_date}&defects_type=${defects_type}`
      );
      this.store.setGraphSummaryList(res?.data || []);
      return res?.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_SUMMARY_DEFECTS_ERROR", error);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  public getTopDefects = async (
    start_date: string,
    end_date: string,
    process_id: string,
    shift: string,
    ranking: number,
    defects_type: "ALL" | "P" | "S"
  ): Promise<TTopDefect[]> => {
    if ((process_id ?? "") == "") {
      return [];
    }

    try {
      const { data: res } = await this.get<TResponse<TTopDefect[]>>(
        `/defects-logging/top-rank-by-date-range?start_date=${start_date}&end_date=${end_date}&process_id=${process_id}&shift=${shift}&ranking=${ranking}&defects_type=${defects_type}`
      );
      this.store.setTopDefectList(res?.data || []);
      return res?.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_TOP_DEFECTS_ERROR", error);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  public getSummaryDefectsByPartGraph = async (
    start_date: string,
    end_date: string,
    process_id: string,
    defects_type: "ALL" | "P" | "S"
  ): Promise<TPartSummary[]> => {
    if ((process_id ?? "") == "") {
      return [];
    }

    try {
      const { data: res } = await this.get<TResponse<TPartSummary[]>>(
        `/defects-logging/graph-summary-part-by-date-range?start_date=${start_date}&end_date=${end_date}&process_id=${process_id}&defects_type=${defects_type}`
      );
      this.store.setPartSummaryList(res?.data || []);
      return res?.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_SUMMARY_DEFECTS_ERROR", error);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };

  public getSummaryDefectsByModelGraph = async (
    start_date: string,
    end_date: string,
    defects_type: "ALL" | "P" | "S"
  ): Promise<TModelSummary[]> => {
    try {
      const { data: res } = await this.get<TResponse<TModelSummary[]>>(
        `/defects-logging/graph-model-by-date-range?start_date=${start_date}&end_date=${end_date}&defects_type=${defects_type}`
      );
      this.store.setModelSummaryList(res?.data || []);
      return res?.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("GET_SUMMARY_DEFECTS_ERROR", error);
        return [];
      } else {
        console.error("UNKNOWN_ERROR", error);
        return [];
      }
    }
  };
}
