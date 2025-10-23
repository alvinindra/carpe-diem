import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { AuthUser } from '@/lib/session'
import { getUserFromTokenFn } from '@/lib/session'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const userData = await getUserFromTokenFn({ data: token })
        setUser(userData)
      } catch (error) {
        // Invalid token, clear it
        localStorage.removeItem('authToken')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    navigate({ to: '/captain/login' })
  }

  const getToken = () => {
    return localStorage.getItem('authToken')
  }

  return { user, loading, logout, getToken }
}
