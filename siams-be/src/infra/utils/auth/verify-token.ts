import jwt from 'jsonwebtoken'
import config from '@/config'
import { User } from '@domain/entities'
import { UnauthorizedError } from '@shared/errors'

export function verifyToken<T = User>(token: string): T {
  try {
    return jwt.verify(token, config.app.jwtSecret as string) as unknown as T
  } catch (err) {
    console.error(err)
    throw new UnauthorizedError('Your token is invalid or expired')
  }
}
