'use client'

import { Suspense } from 'react'
import LoginPage from './login-page'

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div>Loading...</div></div>}>
      <LoginPage />
    </Suspense>
  )
}
