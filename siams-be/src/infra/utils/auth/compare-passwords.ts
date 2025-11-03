import bcrypt from 'bcrypt'

export async function comparePasswords(password: string, encryptedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, encryptedPassword)
}
