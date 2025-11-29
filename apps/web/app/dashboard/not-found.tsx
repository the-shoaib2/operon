"use client"

import { NotFoundErrorCard } from "@/components/error-cards"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function DashboardNotFound() {
  const router = useRouter()

  const handleGoToDashboard = () => {
    router.push("/dashboard")
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
            resourceType="Dashboard Page"
            action={{
              label: "Dashboard",
              onClick: handleGoToDashboard,
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
