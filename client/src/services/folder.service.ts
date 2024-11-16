import { API_BASE_URL } from "@/helpers/common.helper";
import { TCreateUpdateFolder, TFolder, TResponse } from "@/types";
import { AxiosError } from "axios";
import { useAtomStore } from "../store/use-atom-store";
import { APIService } from "./api.service";

export class FolderService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getFolders = async (): Promise<TFolder[]> => {
    try {
      const { data } = await this.get<TResponse<TFolder[]>>(`/folders`);
      this.store.setFolderList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createFolder = async (data: TCreateUpdateFolder): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>("/folders", data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_FOLDER_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create folder",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create folder",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updateFolder = async (data: TCreateUpdateFolder): Promise<TResponse<unknown>> => {
    try {
      const response = await this.put<TResponse<unknown>>(`/folders`, data);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_FOLDER_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update folder",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update folder",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deleteFolder = async (folder_id: string): Promise<TResponse<unknown>> => {
    try {
      const response = await this.delete<TResponse<unknown>>(`folders?folder_id=${folder_id}`);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_FOLDER_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete folder",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete folder",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
