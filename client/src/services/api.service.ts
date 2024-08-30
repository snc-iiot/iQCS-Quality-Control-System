/* eslint-disable @typescript-eslint/no-explicit-any */
import { EUserRole } from "@/constants/auth";
import { LocalStorageManager } from "@/helpers/local-storage-manger";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export abstract class APIService {
  private navigate = useNavigate();
  protected baseURL: string;
  protected axiosInstance: AxiosInstance;

  localStorageManager = LocalStorageManager;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
      headers: this.getDefaultHeaders(),
    });

    this.setupInterceptors();
  }

  getUserRole(): EUserRole {
    const user = this.localStorageManager.getItem("TOOLBOX_USER");
    return user ? user.role : EUserRole.GUEST;
  }

  setUserRole(role: EUserRole): void {
    this.localStorageManager.setItem("TOOLBOX_USER", {
      ...this.localStorageManager.getItem("TOOLBOX_USER"),
      role,
    });
  }

  private getAccessToken(): string | null {
    return this.localStorageManager.getItem("TOOLBOX_ACCESS_TOKEN") || null;
  }

  private getDefaultHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  setAccessToken(token: string): void {
    this.localStorageManager.setItem("TOOLBOX_ACCESS_TOKEN", token);
  }

  removeAccessToken(): void {
    this.localStorageManager.removeItem("TOOLBOX_ACCESS_TOKEN");
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          console.log("401 error");
          this.removeAccessToken();
          this.navigate("/login");
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
