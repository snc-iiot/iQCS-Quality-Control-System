/* eslint-disable @typescript-eslint/no-explicit-any */
import { EUserRole } from "@/constants/auth";
import { LocalStorageManager } from "@/helpers/local-storage-manger";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export abstract class APIService {
  // private navigate = useNavigate();
  protected baseURL: string;
  protected axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
      headers: this.getDefaultHeaders(),
    });

    this.setupInterceptors();
  }

  getUserRole(): EUserRole {
    return LocalStorageManager.getItem("TOOLBOX_ROLE") || EUserRole.USER;
  }

  setUserRole(role: EUserRole): void {
    LocalStorageManager.setItem("TOOLBOX_ROLE", role);
  }

  private getAccessToken(): string | null {
    return LocalStorageManager.getItem("TOOLBOX_ACCESS_TOKEN") || null;
  }

  private getDefaultHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  setAccessToken(token: string): void {
    LocalStorageManager.setItem("TOOLBOX_ACCESS_TOKEN", token);
  }

  removeAccessToken(): void {
    LocalStorageManager.removeItem("TOOLBOX_ACCESS_TOKEN");
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          console.log("401 error");
          this.removeAccessToken();
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  post<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  put<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  patch<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  delete<T>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, {
      data,
      ...config,
    });
  }

  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.request<T>(config);
  }
}
