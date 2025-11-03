import jwt from 'jsonwebtoken'
import config from '@/config'
import { User } from '@domain/entities'
import { TokenError } from '@shared/errors/token-error'

export function verifyToken<T = User>(token: string): T {
  try {
    return jwt.verify(token, config.app.jwtSecret as string) as unknown as T
  } catch (err) {
    console.error(err)
    throw new TokenError()
  }
}
