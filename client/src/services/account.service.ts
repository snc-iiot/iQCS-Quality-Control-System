import { API_BASE_URL } from "@/helpers/common.helper";
import { useAtomStore } from "@/store";
import { TAccount, TCreateUpdateAccount, TResponse } from "@/types";
import { APIService } from "./api.service";

//FIXME: Account is  Operator in the system

export class AccountService extends APIService {
  atomStore = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getAccounts = async (): Promise<TAccount[]> => {
    try {
      const { data } = await this.get<TResponse<TAccount[]>>(`/operators`);
      this.atomStore.setAccountList(data?.data ?? []);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createAccount = async (data: TCreateUpdateAccount): Promise<TResponse<unknown>> => {
    try {
      const { data: response } = await this.post<TResponse<TAccount>>(`/operators`, data);
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
      const { data: response } = await this.put<TResponse<TAccount>>(`/operators`, data);
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
      const { data } = await this.delete<TResponse<unknown>>(`/operators?operator_id=${id}`);
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
