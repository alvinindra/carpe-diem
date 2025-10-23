import bcrypt from 'bcryptjs'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(
  userId: number,
  email: string,
): Promise<string> {
  const token = await new jose.SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(
  token: string,
): Promise<{ userId: number; email: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return {
      userId: payload.userId as number,
      email: payload.email as string,
    }
  } catch (error) {
    return null
  }
}
