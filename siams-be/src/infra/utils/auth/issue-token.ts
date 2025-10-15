import jwt from 'jsonwebtoken'
import config from '@/config'
import { User } from '@domain/entities'

export function issueToken(payload: Partial<User>, expiresIn?: string): string {
  const jwtToken = jwt.sign(
    payload,
    config.app.jwtSecret as string,
    expiresIn ? { expiresIn: '2d' } : undefined,
  )

  return jwtToken
}
