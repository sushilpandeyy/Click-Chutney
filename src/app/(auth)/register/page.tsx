// src/app/(auth)/register/page.tsx
import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'

interface RegisterPageProps {
  searchParams: Promise<{
    redirectTo?: string
    ref?: string
    error?: string
  }>
}

// Separate component to handle the async searchParams
async function RegisterContent({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const redirectTo = params.redirectTo || "/dashboard"
  const ref = params.ref
  const error = params.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FEF7E0] via-[#FFFFFF] to-[#10B981]/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/20">
            <p className="text-sm text-[#FF4444] font-medium text-center">
              {error}
            </p>
          </div>
        )}
        
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FEF7E0] via-[#FFFFFF] to-[#10B981]/10">
        <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#FFB800] rounded-full flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <RegisterContent {...props} />
    </Suspense>
  )
}