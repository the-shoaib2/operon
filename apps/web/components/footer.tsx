import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Mail, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Brand Section */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Image 
                src="/icons/operone-logo.svg" 
                alt="Operone" 
                width={32} 
                height={32} 
                className="h-8 w-8"
              />
              <div>
                <h3 className="text-lg font-bold text-foreground">Operone</h3>
                <p className="text-xs text-muted-foreground">Modern Stack for Rapid Development</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm">
              Build faster with our pre-configured monorepo.
            </p>
            <div className="flex space-x-3">
              <Link 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link 
                href="mailto:contact@operone.dev" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Operone. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-current" />
              <span>by Operone team</span>
            </div>
            <div className="flex space-x-4 text-xs">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
