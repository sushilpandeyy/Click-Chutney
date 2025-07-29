// src/app/(auth)/register/page.tsx
import { Suspense } from 'react'
import RegisterForm from '@/components/RegisterForm'

interface RegisterPageProps {
  searchParams: Promise<{
    redirectTo?: string
    ref?: string
  }>
}

// Separate component to handle the async searchParams
async function RegisterContent({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const redirectTo = params.redirectTo || "/dashboard"
  const ref = params.ref

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>

        <RegisterForm redirectTo={redirectTo} />

        {/* Referral tracking script */}
        {ref && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Track referral
                localStorage.setItem('referralCode', '${ref}');
              `,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default function RegisterPage(props: RegisterPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <RegisterContent {...props} />
    </Suspense>
  )
}