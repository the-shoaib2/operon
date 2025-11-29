import { Metadata } from 'next'
import FeaturesPage from '@/components/sections/features-page'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Features - Operone',
  description: 'Discover powerful features of Operone including lightning fast performance, enterprise security, cross-platform support, and developer-friendly tools.',
  keywords: ['features', 'performance', 'security', 'cross-platform', 'developer tools'],
  openGraph: {
    title: 'Operone Features',
    description: 'Powerful features for modern development',
    type: 'website',
  },
}

export default function Features() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1">
        <FeaturesPage />
      </main>
      <Footer />
    </div>
  )
}
