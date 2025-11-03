// src/services/api/client.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach interceptors
    this.instance.interceptors.request.use(this.handleRequest);
    this.instance.interceptors.response.use(this.handleResponse, this.handleError);
  }

  private handleRequest(config: InternalAxiosRequestConfig) {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  }

  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  private handleError(error: any) {
    // You can handle 401, 403, or 500 here globally
    if (error.response?.status === 401) {
      console.warn("Unauthorized - token might be expired");
      localStorage.removeItem("token");
      if (error.response?.data?.error === "TokenExpiredError") {
        console.log("Token expired")
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }

  get<T = any>(url: string, query?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, { params: query, ...config });
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}

// Export a singleton
export const apiClient = new ApiClient();
