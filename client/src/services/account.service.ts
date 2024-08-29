import { API_BASE_URL } from "@/helpers/common.helper";
import { TAccount, TCreateUpdateAccount, TResponse } from "@/types";
import { APIService } from "./api.service";

export class AccountService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  public getAccounts = async (): Promise<TAccount[]> => {
    try {
      const { data } = await this.get<TResponse<TAccount[]>>(`/accounts`);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createAccount = async (data: TCreateUpdateAccount): Promise<TResponse<unknown>> => {
    try {
      const { data: response } = await this.post<TResponse<TAccount>>(`/accounts`, data);
      return response;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error creating Account",
        status: "error",
        statusCode: 500,
      };
    }
  };

  public updateAccount = async (data: TCreateUpdateAccount): Promise<TResponse<unknown>> => {
    try {
      const { data: response } = await this.put<TResponse<TAccount>>(`/accounts`, data);
      return response;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error updating Account",
        status: "error",
        statusCode: 500,
      };
    }
  };

  public deleteAccount = async (id: string): Promise<TResponse<unknown>> => {
    try {
      const { data } = await this.delete<TResponse<unknown>>(`/accounts?account_id=${id}`);
      return data;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error deleting Account",
        status: "error",
        statusCode: 500,
      };
    }
  };
}
