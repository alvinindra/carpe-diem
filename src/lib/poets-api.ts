import { createServerFn } from '@tanstack/react-start'
import { verifyToken } from './auth'
import type { Poet } from '@/db'
import { getClient } from '@/db'

// Get all poets for the authenticated user
export const getPoetsFn = createServerFn({
  method: 'GET',
})
  .inputValidator((d: string) => d)
  .handler(async ({ data: token }) => {
    if (!token) {
      throw new Error('Authentication required')
    }

    const payload = await verifyToken(token)
    if (!payload) {
      throw new Error('Invalid token')
    }

    const db = await getClient()
    const poets = (await db`
      SELECT id, title, content, author_id, created_at, updated_at
      FROM poets
      WHERE author_id = ${payload.userId}
      ORDER BY created_at DESC
    `) as Array<any>

    return poets as Array<Poet>
  })

// Get a single poet by ID
export const getPoetByIdFn = createServerFn({
  method: 'GET',
})
  .inputValidator((d: { token: string; poetId: number }) => d)
  .handler(async ({ data }) => {
    if (!data.token) {
      throw new Error('Authentication required')
    }

    const payload = await verifyToken(data.token)
    if (!payload) {
      throw new Error('Invalid token')
    }

    const db = await getClient()
    const poets = (await db`
      SELECT id, title, content, author_id, created_at, updated_at
      FROM poets
      WHERE id = ${data.poetId} AND author_id = ${payload.userId}
    `) as Array<any>

    if (poets.length === 0) {
      throw new Error('Poet not found')
    }

    return poets[0] as Poet
  })

// Create a new poet
export const createPoetFn = createServerFn({
  method: 'POST',
})
  .inputValidator((d: { token: string; title: string; content: any }) => d)
  .handler(async ({ data }) => {
    if (!data.token) {
      throw new Error('Authentication required')
    }

    const payload = await verifyToken(data.token)
    if (!payload) {
      throw new Error('Invalid token')
    }

    const db = await getClient()
    const result = (await db`
      INSERT INTO poets (title, content, author_id)
      VALUES (${data.title}, ${JSON.stringify(data.content)}, ${payload.userId})
      RETURNING id, title, content, author_id, created_at, updated_at
    `) as Array<any>

    return result[0] as Poet
  })

// Update a poet
export const updatePoetFn = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (d: { token: string; poetId: number; title: string; content: any }) => d,
  )
  .handler(async ({ data }) => {
    if (!data.token) {
      throw new Error('Authentication required')
    }

    const payload = await verifyToken(data.token)
    if (!payload) {
      throw new Error('Invalid token')
    }

    const db = await getClient()
    const result = (await db`
      UPDATE poets
      SET title = ${data.title}, content = ${JSON.stringify(data.content)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${data.poetId} AND author_id = ${payload.userId}
      RETURNING id, title, content, author_id, created_at, updated_at
    `) as Array<any>

    if (result.length === 0) {
      throw new Error('Poet not found or unauthorized')
    }

    return result[0] as Poet
  })

// Delete a poet
export const deletePoetFn = createServerFn({
  method: 'POST',
})
  .inputValidator((d: { token: string; poetId: number }) => d)
  .handler(async ({ data }) => {
    if (!data.token) {
      throw new Error('Authentication required')
    }

    const payload = await verifyToken(data.token)
    if (!payload) {
      throw new Error('Invalid token')
    }

    const db = await getClient()
    const result = (await db`
      DELETE FROM poets
      WHERE id = ${data.poetId} AND author_id = ${payload.userId}
      RETURNING id
    `) as Array<any>

    if (result.length === 0) {
      throw new Error('Poet not found or unauthorized')
    }

    return { success: true }
  })

// Get all poets with pagination (public)
export const getPublicPoetsFn = createServerFn({
  method: 'GET',
})
  .inputValidator((d: { page?: number; limit?: number }) => d)
  .handler(async ({ data }) => {
    const page = data.page || 1
    const limit = data.limit || 10
    const offset = (page - 1) * limit

    const db = await getClient()
    const poets = (await db`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.author_id, 
        p.created_at, 
        p.updated_at,
        u.full_name as author_name,
        u.email as author_email
      FROM poets p
      LEFT JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `) as Array<any>

    return poets
  })
