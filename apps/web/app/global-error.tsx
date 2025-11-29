"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const handleRefresh = () => {
    reset()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <html>
      <body>
        <div className="flex flex-col min-h-screen w-full">
          <Header />
          <main className="flex-1">
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="max-w-md mx-auto text-center">
                <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold mb-2">Critical Error</h1>
                <p className="text-muted-foreground mb-6">
                  A critical error occurred. The application has been stopped to prevent further issues.
                </p>
                {error?.digest && (
                  <p className="text-xs text-muted-foreground mb-6">
                    Error ID: {error.digest}
                  </p>
                )}
                <div className="flex gap-2 justify-center">
                  <button onClick={handleRefresh} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Try Again
                  </button>
                  <button onClick={handleGoHome} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
