import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    /**
     * Control where users are redirected after sign in
     */
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      
      // Default redirect to dashboard
      return `${baseUrl}/dashboard`
    },

    /**
     * Control authorization for routes
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAuthSuccess = nextUrl.pathname.startsWith('/auth-success')
      const isOnLogin = nextUrl.pathname.startsWith('/login')
      const isFromDesktop = nextUrl.searchParams.get('from') === 'desktop'

      // Protect dashboard routes - require authentication
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      // If logged in and trying to access login page, redirect to dashboard
      if (isLoggedIn && isOnLogin && !isFromDesktop) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      
      // Handle desktop authentication flow
      if (isLoggedIn && isFromDesktop) {
        // Avoid infinite redirect if already on auth-success
        if (isOnAuthSuccess) return true
        return Response.redirect(new URL('/auth-success?from=desktop', nextUrl))
      }
      
      // Allow access to all other pages (including root page)
      return true
    },

    /**
     * Additional sign-in validation
     */
    async signIn({ user }) {
      // You can add additional validation here
      // For example, check if user email is from allowed domain
      console.log('User signing in:', user.email)
      
      // Allow sign in
      return true
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Enable debug messages in development only when explicitly requested
  debug: process.env.NODE_ENV === 'development' && process.env.AUTH_DEBUG === 'true',
} satisfies NextAuthConfig

