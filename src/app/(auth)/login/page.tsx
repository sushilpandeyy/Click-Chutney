// src/app/(auth)/login/page.tsx
import { Suspense } from "react"
import { Metadata } from "next"
import { LoginForm } from "@/components/auth/LoginForm"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Login | ClickChutney - Spicy Analytics",
  description: "Log in to your ClickChutney dashboard and spice up your analytics journey!",
  keywords: ["login", "signin", "authentication", "analytics", "dashboard"],
}

// Loading component for Suspense
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🥭</span>
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Heating up the kitchen... 🔥</p>
      </div>
    </div>
  )
}

interface LoginPageProps {
  searchParams: {
    redirectTo?: string
    error?: string
    message?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams.redirectTo || "/dashboard"
  
  return (
    <>
      {/* SEO and Social Meta Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Login to ClickChutney",
            "description": "Access your spicy analytics dashboard",
            "url": "https://clickchutney.com/login",
            "provider": {
              "@type": "Organization",
              "name": "ClickChutney",
              "url": "https://clickchutney.com"
            }
          })
        }}
      />
      
      <Suspense fallback={<LoginLoading />}>
        <LoginForm redirectTo={redirectTo} />
      </Suspense>
      
      {/* Error/Success Messages from URL params */}
      {searchParams.error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-sm">
            <p className="text-sm">{searchParams.error}</p>
          </div>
        </div>
      )}
      
      {searchParams.message && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg max-w-sm">
            <p className="text-sm">{searchParams.message}</p>
          </div>
        </div>
      )}
    </>
  )
}