// src/app/(auth)/login/page.tsx
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error === 'CredentialsSignin' 
                ? 'Authentication failed. Please try again.' 
                : 'Something went wrong. Please try again.'}
            </AlertDescription>
          </Alert>
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
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <LoginContent {...props} />
    </Suspense>
  )
}