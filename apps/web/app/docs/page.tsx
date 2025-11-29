import { Metadata } from 'next'
import DocsPage from '@/components/sections/docs-page'
import Header from '@/components/sections/header'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'Documentation - Operone',
  description: 'Complete documentation for Operone including getting started guides, API reference, security best practices, and deployment instructions.',
  keywords: ['documentation', 'docs', 'api', 'guide', 'tutorial', 'getting started'],
  openGraph: {
    title: 'Operone Documentation',
    description: 'Complete developer documentation',
    type: 'website',
  },
}

export default function Docs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <DocsPage />
      </main>
      <Footer />
    </div>
  )
}
