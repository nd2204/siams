import type { UserData } from "./user-data"

export interface AuthResponse {
  user: UserData,
  token: string
  refreshToken?: string;
  expiresIn?: number; // seconds
}
