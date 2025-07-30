// src/app/(auth)/login/page.tsx
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

interface LoginPageProps {
  searchParams: Promise<{
    redirectTo?: string
    error?: string
  }>
}

// Separate component to handle the async searchParams
async function LoginContent({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const redirectTo = params.redirectTo || "/dashboard"
  const error = params.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FEF7E0] via-[#FFFFFF] to-[#10B981]/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/20">
            <p className="text-sm text-[#FF4444] font-medium text-center">
              {error === 'CredentialsSignin' 
                ? 'Invalid credentials! Check your recipe again 🔍' 
                : 'Authentication failed. Please try again.'}
            </p>
          </div>
        )}
        
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  )
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FEF7E0] via-[#FFFFFF] to-[#10B981]/10">
        <div className="w-16 h-16 bg-gradient-to-br from-[#FFB800] to-[#FF4444] rounded-full flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <LoginContent {...props} />
    </Suspense>
  )
}