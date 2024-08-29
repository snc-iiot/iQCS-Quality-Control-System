import { API_BASE_URL } from "@/helpers/common.helper";
import { TCreateUpdateProcess, TProcess, TProcessesOrder, TResponse } from "@/types";
import { AxiosError } from "axios";
import { useAtomStore } from "../store/use-atom-store";
import { APIService } from "./api.service";

export class ProcessService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getProcess = async (): Promise<TProcess[]> => {
    try {
      const { data } = await this.get<TResponse<TProcess[]>>(`/processes`);
      this.store.setProcessList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public getOneProcess = async (process_id: string): Promise<TProcess[]> => {
    try {
      const { data } = await this.get<TResponse<TProcess[]>>(`/processes/info?process_id=${process_id}`);
      this.store.setProcessList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createProcess = async (data: TCreateUpdateProcess): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>("/processes", data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_PROCESS_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create Process",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create Process",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updateProcess = async (data: TCreateUpdateProcess): Promise<TResponse<unknown>> => {
    try {
      const response = await this.put<TResponse<unknown>>(`/processes`, data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_PROCESS_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update Process",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update Process",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deleteProcess = async (process_id: string): Promise<TResponse<unknown>> => {
    try {
      const response = await this.delete<TResponse<unknown>>(`/processes?process_id=${process_id}`);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_PROCESS_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete Process",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete Process",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public patchProcessesOrder = async (data: TProcessesOrder): Promise<TResponse<unknown>> => {
    try {
      const response = await this.patch<TResponse<unknown>>(`/processes/order`, data);
      return response?.data ?? [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("PATCH_ONE_PROCESS_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to patch processes order",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to patch processes order",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
