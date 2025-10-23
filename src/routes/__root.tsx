import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { Button } from '../components/ui/button'

import appCss from '../styles/app.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Carpe Diem - Seize the Day through Poetry',
      },
      {
        name: 'description',
        content: 'A beautiful, modern poetry platform where you can share your verses, express your soul, and join a community of wordsmiths. Built with TanStack Start and Neon Database.',
      },
      {
        name: 'keywords',
        content: 'poetry, poems, creative writing, verse, literature, carpe diem, poetry platform, writing community',
      },
      {
        name: 'author',
        content: 'Carpe Diem Poetry',
      },
      // Open Graph / Facebook
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: 'Carpe Diem - Seize the Day through Poetry',
      },
      {
        property: 'og:description',
        content: 'A beautiful, modern poetry platform where you can share your verses, express your soul, and join a community of wordsmiths.',
      },
      {
        property: 'og:image',
        content: '/og-image.svg',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'Carpe Diem - Seize the Day through Poetry',
      },
      {
        property: 'og:site_name',
        content: 'Alvin',
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Carpe Diem - Seize the Day through Poetry',
      },
      {
        name: 'twitter:description',
        content: 'A beautiful, modern poetry platform where you can share your verses, express your soul, and join a community of wordsmiths.',
      },
      {
        name: 'twitter:image',
        content: '/og-image.svg',
      },
      {
        name: 'twitter:image:alt',
        content: 'Carpe Diem - Seize the Day through Poetry',
      },
      // Additional SEO
      {
        name: 'theme-color',
        content: '#0A0A0B',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: '/logo192.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'sitemap',
        type: 'application/xml',
        href: '/sitemap.xml',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <RootDocument>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-6 px-4">
          <h1
            className="text-8xl text-foreground font-serif"
          >
            404
          </h1>
          <h2
            className="text-5xl font-serif"
          >
            Not Found
          </h2>
          <p className="text-lg text-balance text-muted-foreground max-w-md mx-auto">
            Like a verse lost in the mist, what you seek is just out of reach.
          </p>
          <div className="pt-4">
            <Button asChild size="lg">
              <Link to="/">
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </RootDocument>
  )
}
