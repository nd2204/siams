import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";

import type { UserLoginRequest } from "./dtos/auth/user-login-request";
import type { UserRegisterRequest } from "./dtos/auth/user-register-request";
import type { UserData } from "./dtos/auth/user-data";
import type { AuthResponse } from "./dtos/auth/auth-response";

// Set token in API client
function setAuthToken(token: string) {
  apiClient.setAuthToken(token);
}

// Clear token from API client
function clearAuthToken() {
  apiClient.setAuthToken(null);
}

export const authService = {
  async signin(data: UserLoginRequest): Promise<AuthResponse> {
    const result = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNIN, data);
    if (result.token) setAuthToken(result.token);
    return result;
  },

  async signup(data: UserRegisterRequest): Promise<AuthResponse> {
    const result = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNUP, data);
    if (result.token) setAuthToken(result.token);
    return result;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const result = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    if (result.token) setAuthToken(result.token);
    return result;
  },

  async me(): Promise<UserData> {
    return apiClient.get<UserData>(ENDPOINTS.AUTH.ME);
  },

  logout() {
    clearAuthToken();
  }
};
