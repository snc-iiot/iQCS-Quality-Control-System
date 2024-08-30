import { EUserRole } from "@/constants/auth";
import { API_BASE_URL } from "@/helpers/common.helper";
import { TAuth, TChangePassword, TRequestSignIn, TResponse } from "@/types";
import { AxiosError } from "axios";
import { APIService } from "./api.service";

export class AuthService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  signIn = async (req: TRequestSignIn): Promise<TResponse<TAuth[]>> => {
    try {
      const { data } = await this.post<TResponse<TAuth[]>>(`/users/login`, req);
      if (data.status === "success") {
        this.setAccessToken(data.data?.[0]?.token);
        this?.setUserRole(
          data.data?.[0]?.role
            ? data.data?.[0]?.role === "ADMIN"
              ? EUserRole.ADMIN
              : data.data?.[0]?.role === "USER"
                ? EUserRole.USER
                : EUserRole.GUEST
            : EUserRole.GUEST
        );
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

  changePassword = async (req: TChangePassword): Promise<TResponse<[]>> => {
    try {
      const { data } = await this.patch<TResponse<[]>>(`/users/change-password`, req);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("CHANGE_PASSWORD_ERROR", error);
        return {
          message: error.response?.data?.message || "Failed to change password due to an unknown error",
          statusCode: error.response?.status ?? 500,
          status: "error",
          data: [],
        };
      } else {
        console.error("UNKNOWN_ERROR", error);
        return {
          message: "Failed to change password due to an unknown error",
          statusCode: 500,
          status: "error",
          data: [],
        };
      }
    }
  };
}
