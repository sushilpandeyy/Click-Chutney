// src/app/(auth)/register/page.tsx
import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <RegisterContent {...props} />
    </Suspense>
  )
}