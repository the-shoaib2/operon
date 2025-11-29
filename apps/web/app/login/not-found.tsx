"use client"

import { NotFoundErrorCard } from "@/components/error-cards"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LoginNotFound() {
  const router = useRouter()

  const handleGoToLogin = () => {
    router.push("/login")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1">
        <div className="min-h-screen flex items-center justify-center p-4">
          <NotFoundErrorCard
            resourceType="Login Page"
            action={{
              label: "Back to Login",
              onClick: handleGoToLogin,
            }}
            secondaryAction={{
              label: "Go Home",
              onClick: handleGoHome,
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
