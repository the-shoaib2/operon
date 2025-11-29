"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { HeaderUser } from "@/components/header-user"
import { useState, useEffect } from "react"

export default function Header() {
  const { data: session, status } = useSession()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/icons/operone-logo.svg" alt="Operone" width={48} height={48} className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block uppercase">
              Operone
            </span>
          </Link>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Link
              href="/download"
              className="transition-colors hover:bg-muted px-3 py-1.5 rounded-full text-foreground/60 hover:text-foreground"
            >
              Download
            </Link>
            <Link
              href="/features"
              className="transition-colors hover:bg-muted px-3 py-1.5 rounded-full text-foreground/60 hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:bg-muted px-3 py-1.5 rounded-full text-foreground/60 hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="transition-colors hover:bg-muted px-3 py-1.5 rounded-full text-foreground/60 hover:text-foreground"
            >
              Docs
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {status === 'loading' ? (
              <>
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                <div className="w-16 h-8 bg-muted rounded-full animate-pulse" />
              </>
            ) : session ? (
              <HeaderUser
                user={{
                  name: session.user?.name || "",
                  email: session.user?.email || "",
                  image: session.user?.image || ""
                }}
                isMobile={isMobile}
              />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted">
                    Log in
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="rounded-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
    </header>
  )
}
