import type { Metadata } from "next";
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Login - Operone",
  description: "Sign in to your Operone account",
  icons: {
    icon: "/logo/passkey.svg",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1">
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
