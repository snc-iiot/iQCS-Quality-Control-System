import { API_BASE_URL } from "@/helpers/common.helper";
import { TCreateUpdateMachine, TMachine, TResponse } from "@/types";
import { APIService } from "./api.service";
import { useAtomStore } from "@/store";

export class MachineService extends APIService {
  atomStore = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getMachines = async (): Promise<TMachine[]> => {
    try {
      const { data } = await this.get<TResponse<TMachine[]>>(`/machines`);
      this.atomStore.setMachineList(data?.data ?? []);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createMachine = async (data: TCreateUpdateMachine): Promise<TResponse<unknown>> => {
    try {
      const { data: response } = await this.post<TResponse<TMachine>>(`/machines`, data);
      return response;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error creating Machine",
        status: "error",
        statusCode: 500,
      };
    }
  };

  public updateMachine = async (data: TCreateUpdateMachine): Promise<TResponse<unknown>> => {
    try {
      const { data: response } = await this.put<TResponse<TMachine>>(`/machines`, data);
      return response;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error updating Machine",
        status: "error",
        statusCode: 500,
      };
    }
  };

  public deleteMachine = async (id: string): Promise<TResponse<unknown>> => {
    try {
      const { data } = await this.delete<TResponse<unknown>>(`/machines?machine_id=${id}`);
      return data;
    } catch (error) {
      console.error(error);
      return {
        data: null,
        message: "Error deleting Machine",
        status: "error",
        statusCode: 500,
      };
    }
  };
}
