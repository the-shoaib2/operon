"use client"

import { InternalServerErrorCard } from "@/components/error-cards"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LoginError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const handleRefresh = () => {
    reset()
  }

  const handleGoToLogin = () => {
    window.location.href = "/login"
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1">
        <div className="min-h-screen flex items-center justify-center p-4">
          <InternalServerErrorCard
            errorCode="500"
            timestamp={new Date().toISOString()}
            action={{
              label: "Try Again",
              onClick: handleRefresh,
            }}
            secondaryAction={{
              label: "Back to Login",
              onClick: handleGoToLogin,
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
