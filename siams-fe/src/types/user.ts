import type { UserOrgInfo } from "./organization"
import type { IPaginated } from "./paginated"

export type UserData = {
  id: string,
  name: string,
  email: string,
  organizations?: UserOrgInfo[]
}

// Auth
export interface AuthResponse {
  user: UserData,
  token: string
  refreshToken?: string;
  expiresIn?: number; // seconds
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserLoginRequest {
  email: string,
  password: string,
}

export interface ListUserByNameOrEmailRequest {
  query: string
}

// User
export type ListUserByNameOrEmailResponse = IPaginated<UserData>
