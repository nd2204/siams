import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";

import type { UserLoginRequest } from "./dtos/auth/user-login-request";
import type { UserRegisterRequest } from "./dtos/auth/user-register-request";
import type { UserDTO } from "./dtos/auth/user-dto";
import type { AuthResponse } from "./dtos/auth/auth-response";


function saveAuthResponse(result: AuthResponse) {
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));
}

export const authService = {
  async signin(data: UserLoginRequest): Promise<AuthResponse> {
    const result = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNIN, data);
    saveAuthResponse(result)
    return result;
  },

  async signup(data: UserRegisterRequest): Promise<AuthResponse> {
    const result = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNUP, data);
    saveAuthResponse(result)
    return result
  },

  async me(): Promise<UserDTO> {
    return apiClient.get<UserDTO>(ENDPOINTS.AUTH.ME);
  },

};
