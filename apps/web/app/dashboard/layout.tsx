import { Metadata } from "next"
import { AppSidebar } from "@/components/page-nav"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Dashboard - Operone",
  description: "Manage your Operone account and passkeys",
  icons: {
    icon: "/logo/passkey.svg",
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen w-full">
        <Header />
      <div className="flex flex-1">
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1 bg-background overflow-auto">
            <div className="px-4 sm:px-6 py-4 sm:py-6 pb-20">
          {children}
        </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
