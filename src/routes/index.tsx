import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getPublicPoetsFn } from '@/lib/poets-api'

export const Route = createFileRoute('/')({ component: App })

type PoetWithAuthor = {
  id: number
  title: string
  content: any
  author_id: number
  created_at: Date
  updated_at: Date
  author_name: string | null
  author_email: string | null
}

function App() {
  const observerTarget = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['public-poets'],
    queryFn: async ({ pageParam = 1 }) => {
      const poets = await getPublicPoetsFn({ data: { page: pageParam, limit: 10 } })
      return { poets, nextPage: pageParam + 1 }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.poets.length < 10) return undefined
      return lastPage.nextPage
    },
    initialPageParam: 1,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Extract plain text from Plate.js content
  const extractText = (content: any): string => {
    if (!content) return ''
    try {
      const contentArray = Array.isArray(content) ? content : []
      return contentArray
        .map((node: any) => {
          if (node.type === 'p' && node.children) {
            return node.children.map((child: any) => child.text || '').join('')
          }
          return ''
        })
        .join(' ')
        .slice(0, 200)
    } catch (error) {
      return ''
    }
  }

  const allPoets = data?.pages.flatMap((page) => page.poets) || []

  return (
    <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#2C2416] transition-colors">
      {/* Header */}
      <header className="py-16 px-6 text-center border-b border-neutral-300/50 dark:border-neutral-700/50">
        <h1 className="text-6xl md:text-8xl font-serif text-neutral-900 dark:text-neutral-50 tracking-tight">
          Carpe Diem
        </h1>
      </header>

      {/* Poets List */}
      <main className="max-w-xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            Loading poets...
          </div>
        ) : allPoets.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            No poets yet. Be the first to share your words.
          </div>
        ) : (
          <div className="space-y-6">
            {allPoets.map((poet: PoetWithAuthor) => (
              <article
                key={poet.id}
                className="group relative bg-[#FFFEF9] dark:bg-[#3A3020] border-0 border-accent-900/20 dark:border-amber-700/30 rounded-sm p-8"
              >
                <div className="space-y-3">
                  {/* Title */}
                  <h2 className="text-2xl text-center font-serif text-amber-950 dark:text-amber-50 leading-tight tracking-wide">
                    {poet.title}
                  </h2>

                  {/* Content Preview */}
                  <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed line-clamp-3">
                    {extractText(poet.content)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex justify-end items-center gap-4 text-sm text-amber-800/70 dark:text-amber-300/70 pt-2">
                    {/* <span className="font-medium">
                      {poet.author_name || poet.author_email || 'Anonymous'}
                    </span>
                    <span>•</span> */}
                    <time dateTime={new Date(poet.created_at).toISOString()}>
                      {new Date(poet.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="py-8 text-center">
          {isFetchingNextPage && (
            <div className="text-neutral-500 dark:text-neutral-400">
              Loading more...
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
