import type { UserDTO } from "./user-dto"

export interface AuthResponse {
  user: UserDTO
  token: string
}
