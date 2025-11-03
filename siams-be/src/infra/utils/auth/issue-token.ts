import jwt from 'jsonwebtoken'
import config from '@/config'
import { AuthResponse } from '@feature/user/dtos/auth-response'

export function issueToken(payload: AuthResponse["user"], expiresIn?: string): string {
  const jwtToken = jwt.sign(
    payload,
    config.app.jwtSecret as string,
    expiresIn ? { expiresIn: '2d' } : undefined,
  )

  return jwtToken
}
