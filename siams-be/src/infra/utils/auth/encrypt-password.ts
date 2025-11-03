import bcrypt from 'bcrypt'

export async function encryptPassword(rawPassword: string): Promise<{ password: string; salt: string }> {
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(rawPassword, salt)
  return { password, salt }
}
