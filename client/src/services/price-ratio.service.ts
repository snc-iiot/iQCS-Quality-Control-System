import { API_BASE_URL } from "@/helpers/common.helper";
import { useAtomStore } from "@/store";
import { TCreateUpdatePriceRatio, TPriceRatio, TResponse } from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class PriceRatioService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getPriceRatios = async (): Promise<TPriceRatio[]> => {
    try {
      const { data } = await this.get<TResponse<TPriceRatio[]>>(`/price-ratios`);
      this.store.setPriceRatioList(data?.data ?? []);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createPriceRatio = async (data: TCreateUpdatePriceRatio): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>("/price-ratios", data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_PRICE_RATIO_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create price ratio",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create price ratio",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updatePriceRatio = async (data: TCreateUpdatePriceRatio): Promise<TResponse<unknown>> => {
    try {
      const response = await this.put<TResponse<unknown>>(`/price-ratios`, data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_PRICE_RATIO_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update price ratio",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update price ratio",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deletePriceRatio = async (id: string): Promise<TResponse<unknown>> => {
    try {
      const response = await this.delete<TResponse<unknown>>(`/price-ratios?ratio_id=${id}`);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_PRICE_RATIO_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete price ratio",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete price ratio",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
