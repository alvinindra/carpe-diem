import { createServerFn } from '@tanstack/react-start'
import { hashPassword, verifyPassword, createToken, verifyToken } from './auth'
import type { User } from '@/db'
import { getClient } from '@/db'

export type AuthUser = {
  id: number
  email: string
  full_name: string | null
}

// Server function to sign up a new user
export const signupFn = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (d: { email: string; password: string; fullName: string }) => d,
  )
  .handler(async ({ data }) => {
    const db = await getClient()

    // Check if user already exists
    const existingUsers = (await db`
      SELECT id FROM users WHERE email = ${data.email}
    `) as Array<any>

    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists')
    }

    // Hash password and create user
    const passwordHash = await hashPassword(data.password)
    const result = (await db`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${data.email}, ${passwordHash}, ${data.fullName})
      RETURNING id, email, full_name
    `) as Array<any>

    const user = result[0]

    // Create token and set cookie
    const token = await createToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      token,
    }
  })

// Server function to log in
export const loginFn = createServerFn({
  method: 'POST',
})
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const db = await getClient()

    // Find user
    const users = (await db`
      SELECT id, email, password_hash, full_name FROM users WHERE email = ${data.email}
    `) as Array<any>

    if (users.length === 0) {
      throw new Error('Invalid email or password')
    }

    const user = users[0] as User

    // Verify password
    const isValid = await verifyPassword(data.password, user.password_hash)

    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    // Create token
    const token = await createToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      token,
    }
  })

// Server function to get current user from token
export const getUserFromTokenFn = createServerFn({
  method: 'GET',
})
  .inputValidator((d: string) => d)
  .handler(async ({ data: token }) => {
    if (!token) {
      return null
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return null
    }

    const db = await getClient()
    const users = (await db`
      SELECT id, email, full_name FROM users WHERE id = ${payload.userId}
    `) as Array<any>

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    }
  })
