"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function AuthGuard({
  children,
  redirectTo = "/login",
  requireAuth = true
}: AuthGuardProps) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending) {
      if (requireAuth && !session?.user) {
        router.push(redirectTo)
      } else if (!requireAuth && session?.user) {
        router.push("/dashboard")
      }
    }
  }, [session, isPending, requireAuth, redirectTo, router])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !session?.user) {
    return null // Will redirect
  }

  if (!requireAuth && session?.user) {
    return null // Will redirect
  }

  return <>{children}</>
}
