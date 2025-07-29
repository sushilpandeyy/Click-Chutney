// src/app/(auth)/register/page.tsx
import { Suspense } from "react"
import { Metadata } from "next"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Join ClickChutney | Spicy Analytics for Everyone",
  description: "Create your free ClickChutney account and start cooking up delicious analytics insights today!",
  keywords: ["register", "signup", "create account", "analytics", "free", "dashboard"],
  openGraph: {
    title: "Join ClickChutney - Free Analytics That Don't Suck",
    description: "Sign up for the most flavorful analytics platform. No boring dashboards, just spicy insights! 🌶️",
    type: "website",
    url: "https://clickchutney.com/register",
    images: [
      {
        url: "https://clickchutney.com/og-register.png",
        width: 1200,
        height: 630,
        alt: "ClickChutney Registration - Join the Kitchen"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Join ClickChutney - Free Spicy Analytics",
    description: "Create your free account and start cooking up amazing analytics! 🔥",
    images: ["https://clickchutney.com/twitter-register.png"]
  }
}

// Loading component for Suspense
function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🥭</span>
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Preparing your kitchen... 👨‍🍳</p>
      </div>
    </div>
  )
}

interface RegisterPageProps {
  searchParams: {
    redirectTo?: string
    ref?: string // Referral tracking
    plan?: string // Pre-selected plan
  }
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
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
            "name": "Create ClickChutney Account",
            "description": "Join thousands of developers using ClickChutney for spicy analytics",
            "url": "https://clickchutney.com/register",
            "provider": {
              "@type": "Organization",
              "name": "ClickChutney",
              "url": "https://clickchutney.com",
              "sameAs": [
                "https://twitter.com/clickchutney",
                "https://github.com/clickchutney"
              ]
            },
            "potentialAction": {
              "@type": "RegisterAction",
              "target": "https://clickchutney.com/register",
              "name": "Create Account"
            }
          })
        }}
      />
      
      {/* Referral tracking script */}
      {searchParams.ref && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Track referral source
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('clickchutney_ref', '${searchParams.ref}');
              }
            `
          }}
        />
      )}
      
      <Suspense fallback={<RegisterLoading />}>
        <RegisterForm redirectTo={redirectTo} />
      </Suspense>
      
      {/* Schema markup for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ClickChutney",
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "Analytics",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free analytics platform with premium features"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1247",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />
    </>
  )
}