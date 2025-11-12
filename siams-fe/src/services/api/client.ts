// src/services/api/client.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { ENDPOINTS } from "./endpoints";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

class ApiClient {
  private instance: AxiosInstance;
  private refreshPromise: Promise<any> | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
    });

    // Attach interceptors
    this.instance.interceptors.request.use(this.handleRequest);
    this.instance.interceptors.response.use(this.handleResponse, this.handleError);
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.instance.defaults.headers.common["Authorization"];
    }
  }

  private handleRequest = (config: InternalAxiosRequestConfig) => {
    const session = localStorage.getItem("session");
    if (session) {
      const { token } = JSON.parse(session);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  }

  private handleResponse = <T>(response: AxiosResponse<T>): T => {
    return response.data;
  }

  private handleError = async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (error.response?.data?.error === 'TokenError' && !originalRequest._retry) {
        // Prevent multiple simultaneous refresh attempts
        if (!this.refreshPromise) {
          this.refreshPromise = this.tryRefreshToken();
        }

        try {
          const session = await this.refreshPromise;
          if (session) {
            // Retry original request with new token
            this.setAuthToken(session.token);
            originalRequest.headers["Authorization"] = `Bearer ${session.token}`;
            return this.instance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
        } finally {
          this.refreshPromise = null;
        }

        // If we get here, refresh failed
        alert(JSON.stringify(error.response?.data))
        localStorage.removeItem("session");
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }

  private async tryRefreshToken(): Promise<any> {
    const session = localStorage.getItem("session");
    if (!session) return null;

    const { refreshToken } = JSON.parse(session);
    if (!refreshToken) return null;

    try {
      // Use a new axios instance to avoid interceptors
      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      if (response.data?.token) {
        // Update session in localStorage
        const newSession = {
          ...JSON.parse(session),
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresAt: Date.now() + (response.data.expiresIn || 24 * 60 * 60) * 1000
        };
        localStorage.setItem("session", JSON.stringify(newSession));
        return newSession;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
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
