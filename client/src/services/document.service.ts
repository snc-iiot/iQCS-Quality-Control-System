import { API_BASE_URL } from "@/helpers/common.helper";
import { TCreateUpdateDocument, TDocument, TResponse } from "@/types";
import { AxiosError } from "axios";
import { useAtomStore } from "../store/use-atom-store";
import { APIService } from "./api.service";

export class DocumentService extends APIService {
  store = useAtomStore();
  constructor() {
    super(API_BASE_URL);
  }

  public getDocuments = async (): Promise<TDocument[]> => {
    try {
      const { data } = await this.get<TResponse<TDocument[]>>(`/documents`);
      this.store.setDocumentList(data?.data);
      return data?.data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public createDocument = async (data: TCreateUpdateDocument): Promise<TResponse<unknown>> => {
    try {
      const response = await this.post<TResponse<unknown>>("/documents", data);
      if (response?.data?.status === "success") {
        this.getDocuments();
      }
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CREATE_DOCUMENT_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to create document",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to create document",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public updateDocument = async (data: TCreateUpdateDocument): Promise<TResponse<unknown>> => {
    try {
      const response = await this.put<TResponse<unknown>>(`/documents`, data);
      if (response?.data?.status === "success") {
        this.getDocuments();
      }
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("UPDATE_DOCUMENT_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to update document",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to update document",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  public deleteDocument = async (document_id: string): Promise<TResponse<unknown>> => {
    try {
      const response = await this.delete<TResponse<unknown>>(`documents?document_id=${document_id}`);
      if (response?.data?.status === "success") {
        this.getDocuments();
      }
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("DELETE_DOCUMENT_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to delete document",
          statusCode: error.response?.status || 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to delete document",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
