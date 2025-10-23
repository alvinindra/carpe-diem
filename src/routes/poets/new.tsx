import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlateEditor } from '@/components/plate-editor'
import { createPoetFn } from '@/lib/poets-api'

export const Route = createFileRoute('/poets/new')({
  component: NewPoetPage,
})

function NewPoetPage() {
  const { user, loading, getToken } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/captain/login' })
    }
  }, [user, loading, navigate])

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }

    const token = getToken()
    if (!token) return

    setSaving(true)
    setError('')

    try {
      await createPoetFn({
        data: {
          token,
          title: title.trim(),
          content: content || [{ type: 'p', children: [{ text: '' }] }],
        },
      })

      navigate({ to: '/captain/dashboard' })
    } catch (err: any) {
      setError(err.message || 'Failed to save poem')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#2C2416] flex items-center justify-center">
        <div className="text-neutral-800 dark:text-neutral-200 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#2C2416]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/captain/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 font-serif mb-2">Create New Poem</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Express your thoughts through poetry</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-950/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Title Input */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-neutral-900 dark:text-neutral-50 text-sm font-medium mb-2">
            Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Enter your poem's title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#FFFEF9] dark:bg-[#3A3020] border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-500"
          />
        </div>

        {/* Editor */}
        <div className="mb-6">
          <label className="block text-neutral-900 dark:text-neutral-50 text-sm font-medium mb-2">
            Content
          </label>
          <PlateEditor
            onChange={(value) => setContent(value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Poem'}
          </Button>
          <Link to="/captain/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

