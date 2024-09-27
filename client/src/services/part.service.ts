import { API_BASE_URL } from "@/helpers/common.helper";
import {
  TCreateUpdateModel,
  TCreateUpdatePart,
  TCreateUpdatePartPrice,
  THistoryUpdatePrice,
  TModel,
  TPart,
  TResponse,
} from "@/types";
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
      const { data } = await this.get<TResponse<TPart[]>>(`/parts`);
      this.store.setPartList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public getHistoryUpdatePrice = async (): Promise<THistoryUpdatePrice[]> => {
    try {
      const { data } = await this.get<TResponse<THistoryUpdatePrice[]>>(`/update-prices`);
      this.store.setHistoryUpdatePriceList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public updatePartPrice = async (data: TCreateUpdatePartPrice): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>(`/update-prices`, data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_PART_PRICE_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update part price",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update part price",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deleteUpdatePrice = async (update_price_id: string): Promise<TResponse<unknown>> => {
    try {
      const response = await this.delete<TResponse<unknown>>(`/update-prices?update_price_id=${update_price_id}`);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_UPDATE_PRICE_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete update price",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete update price",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public createPart = async (data: TCreateUpdatePart): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>("/parts", data);
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

  public importExcelPart = async (data: TCreateUpdatePart[]): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>("/parts/import-excel", {
        data: data,
      });
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("IMPORT_EXCEL_PART_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to import part",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to import part",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updatePart = async (data: TCreateUpdatePart): Promise<TResponse<unknown>> => {
    try {
      const response = await this.put<TResponse<unknown>>(`/parts`, data);
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
      const response = await this.delete<TResponse<unknown>>(`/parts?part_id=${part_code}`);
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

  // Model
  public getModels = async (): Promise<TModel[]> => {
    try {
      const { data } = await this.get<TResponse<TModel[]>>(`/model`);
      this.store.setModelList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createModel = async (data: TCreateUpdateModel): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>("/model", data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_MODEL_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create model",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create model",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updateModel = async (data: TCreateUpdateModel): Promise<TResponse<unknown>> => {
    try {
      const response = await this.put<TResponse<unknown>>(`/model`, data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_MODEL_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update model",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update model",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deleteModel = async (model_id: string): Promise<TResponse<unknown>> => {
    try {
      const response = await this.delete<TResponse<unknown>>(`/model?model_id=${model_id}`);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_MODEL_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete model",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete model",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
