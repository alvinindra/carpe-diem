import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PenTool, Plus, Trash2, Edit, LogOut } from 'lucide-react'
import type { Poet } from '@/db'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getPoetsFn, deletePoetFn } from '@/lib/poets-api'

export const Route = createFileRoute('/captain/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user, loading, logout, getToken } = useAuth()
  const [poets, setPoets] = useState<Array<Poet>>([])
  const [loadingPoets, setLoadingPoets] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/captain/login' })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    const loadPoets = async () => {
      const token = getToken()
      if (!token) return

      try {
        const data = await getPoetsFn({ data: token })
        setPoets(data)
      } catch (error) {
        console.error('Failed to load poets:', error)
      } finally {
        setLoadingPoets(false)
      }
    }

    if (user) {
      loadPoets()
    }
  }, [user, getToken])

  const handleDelete = async (poetId: number) => {
    if (!confirm('Are you sure you want to delete this poem?')) {
      return
    }

    const token = getToken()
    if (!token) return

    try {
      await deletePoetFn({ data: { token, poetId } })
      setPoets(poets.filter(p => p.id !== poetId))
    } catch (error) {
      alert('Failed to delete poem')
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#2C2416] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-pulse-slow">
              <PenTool className="w-16 h-16 text-amber-700 dark:text-amber-500 mx-auto mb-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-50 animate-fade-in">
                O Captain! My Captain!
              </h2>
              <div className="flex justify-center gap-2 mt-4">
                <span className="w-2 h-2 bg-amber-700 dark:bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-amber-700 dark:bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-amber-700 dark:bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#2C2416]">
      {/* Navigation */}
      <nav className="border-b border-neutral-300/50 dark:border-neutral-700/50 bg-[#FFFEF9]/80 dark:bg-[#3A3020]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="cursor-pointer flex items-center gap-3 hover:opacity-80 transition-opacity">
              <PenTool className="w-8 h-8 text-amber-700 dark:text-amber-500" />
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 font-serif">Dead Poets Society</h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-neutral-700 dark:text-neutral-300">Welcome, {user.full_name || user.email}</span>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 font-serif mb-2">Your Poetry</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Share your words with the world</p>
          </div>
          <Link to="/poets/new">
            <Button className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700">
              <Plus className="w-5 h-5 mr-2" />
              New Poem
            </Button>
          </Link>
        </div>

        {loadingPoets ? (
          <div className="text-center text-neutral-600 dark:text-neutral-400 py-12">Loading your poems...</div>
        ) : poets.length === 0 ? (
          <Card className="bg-[#FFFEF9] dark:bg-[#3A3020] border-neutral-300/40 dark:border-neutral-700/40">
            <CardContent className="py-12 text-center">
              <PenTool className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">No poems yet</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">Start creating your first masterpiece</p>
              <Link to="/poets/new">
                <Button className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Poem
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poets.map((poet) => (
              <Card
                key={poet.id}
                className="group relative bg-[#FFFEF9] dark:bg-[#3A3020] border-0 border-accent-900/20 dark:border-amber-700/30 rounded-sm shadow-none"
              >
                <CardHeader>
                  <CardTitle className="text-neutral-900 dark:text-neutral-50 font-serif">{poet.title}</CardTitle>
                  <CardDescription className="text-neutral-600 dark:text-neutral-400">
                    {new Date(poet.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link to="/poets/$poetId/edit" params={{ poetId: String(poet.id) }}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(poet.id)}
                      className="text-red-700 cursor-pointer hover:text-red-600 dark:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

