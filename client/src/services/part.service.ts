import { API_BASE_URL } from "@/helpers/common.helper";
import { TCreateUpdatePart, TPart, TResponse } from "@/types";
import { AxiosError } from "axios";
import { useAtomStore } from "./../store/use-atom-store";
import { APIService } from "./api.service";

export class PartService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getParts = async (): Promise<TPart[]> => {
    try {
      const { data } = await this.get<TResponse<TPart[]>>(`/part-management`);
      this.store.setPartList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createPart = async (data: TCreateUpdatePart): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>("/part-management", data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_PART_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create part",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create part",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updatePart = async (data: TCreateUpdatePart): Promise<TResponse<unknown>> => {
    try {
      const response = await this.put<TResponse<unknown>>(`/part-management`, data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_PART_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update part",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update part",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deletePart = async (part_code: string): Promise<TResponse<unknown>> => {
    try {
      const response = await this.delete<TResponse<unknown>>(`/part-management?part_code=${part_code}`);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_PART_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete part",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete part",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
