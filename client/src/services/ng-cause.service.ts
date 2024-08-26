import { API_BASE_URL } from "@/helpers/common.helper";
import { useAtomStore } from "@/store";
import { TCreateNGCause, TNGCause, TResponse } from "@/types";
import { APIService } from "./api.service";

export class NGCauseService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getNGCauses = async (): Promise<TNGCause[]> => {
    try {
      const { data } = await this.get<TResponse<TNGCause[]>>(`/ng-cases`);
      this.store.setNgCauseList(data?.data ?? []);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createNGCause = async (data: TCreateNGCause): Promise<TResponse<unknown>> => {
    try {
      const { data: response } = await this.post<TResponse<TNGCause>>(`/ng-cases`, data);
      return response;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error creating NG Cause",
        status: "error",
        statusCode: 500,
      };
    }
  };

  public updateNGCause = async (data: TCreateNGCause): Promise<TResponse<unknown>> => {
    try {
      const { data: response } = await this.put<TResponse<TNGCause>>(`/ng-cases`, data);
      return response;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error updating NG Cause",
        status: "error",
        statusCode: 500,
      };
    }
  };

  public deleteNGCause = async (id: string): Promise<TResponse<unknown>> => {
    try {
      const { data } = await this.delete<TResponse<unknown>>(`/ng-cases?ng_id=${id}`);
      return data;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error deleting NG Cause",
        status: "error",
        statusCode: 500,
      };
    }
  };
}
