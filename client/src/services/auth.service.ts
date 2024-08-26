import { API_BASE_URL } from "@/helpers/common.helper";
import { TAuth, TRequestSignIn, TResponse } from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class AuthService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  signIn = async (req: TRequestSignIn): Promise<TResponse<TAuth[]>> => {
    try {
      const { data } = await this.post<TResponse<TAuth[]>>(`/auth/login`, req);
      if (data.status === "success") {
        this.setAccessToken(data.data?.[0]?.token);
      }
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("SIGN_IN_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to sign in due to an unknown error",
          statusCode: error.response?.status ?? 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to sign in due to an unknown error",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  singInWithEmployee = async (req: string): Promise<TResponse<TAuth[]>> => {
    try {
      const { data } = await this.post<TResponse<TAuth[]>>(`/auth/login-with-employee-id`, { employee_id: req });
      if (data.status === "success") {
        this.setAccessToken(data.data?.[0]?.token);
      }
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("SIGN_IN_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to sign in due to an unknown error",
          statusCode: error.response?.status ?? 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to sign in due to an unknown error",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };

  signOut = async (): Promise<boolean> => {
    return Promise.all([this.removeAccessToken()]).then(() => true);
  };
}
