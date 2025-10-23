import { neon } from '@neondatabase/serverless'

let client: ReturnType<typeof neon>

export async function getClient() {
  if (!process.env.VITE_DATABASE_URL) {
    throw new Error('VITE_DATABASE_URL is not set')
  }
  if (!client) {
    client = neon(process.env.VITE_DATABASE_URL)
  }
  return client
}

export type User = {
  id: number
  email: string
  password_hash: string
  full_name: string | null
  created_at: Date
  updated_at: Date
}

export type Poet = {
  id: number
  title: string
  content: any // JSON content from Plate.js
  author_id: number
  created_at: Date
  updated_at: Date
}
