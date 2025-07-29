// src/app/(auth)/login/page.tsx
import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </a>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              {error === 'CredentialsSignin' 
                ? 'Invalid email or password. Please try again.'
                : 'An error occurred during sign in. Please try again.'
              }
            </div>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <LoginContent {...props} />
    </Suspense>
  )
}