"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, AlertCircle } from "lucide-react"
import { authActions } from "@/lib/auth-client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface TwitterButtonProps {
  disabled?: boolean
  redirectTo?: string
  mode?: "signin" | "signup"
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline"
}

// Twitter/X SVG Icon Component
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export function TwitterButton({
  disabled = false,
  redirectTo = "/dashboard",
  mode = "signin",
  className,
  size = "lg",
  variant = "default"
}: TwitterButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTwitterSignIn = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await authActions.signInWithTwitter(redirectTo)

      if (result.success) {
        toast.success("🎉 X Connected!", {
          description: "Redirecting to your dashboard...",
        })
      } else {
        throw new Error(result.error || "X authentication failed")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "X authentication failed"
      setError(errorMessage)

      toast.error("Authentication Failed!", {
        description: errorMessage,
      })

      setIsLoading(false)
    }
  }

  const buttonText = mode === "signin" ? "Sign in with X" : "Sign up with X"
  const loadingText = "Connecting to X..."

  const baseStyles = variant === "outline"
    ? "border-2 border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white"
    : "bg-[#000000] hover:bg-[#1a1a1a] text-white"

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleTwitterSignIn}
        disabled={disabled || isLoading}
        size={size}
        className={cn(
          "w-full font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-0",
          baseStyles,
          size === "lg" && "h-14 text-base",
          size === "default" && "h-12 text-sm",
          size === "sm" && "h-10 text-xs",
          className
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-3" />
            {loadingText}
          </>
        ) : (
          <>
            <TwitterIcon className="w-5 h-5 mr-3" />
            {buttonText}
            <Sparkles className="w-4 h-4 ml-2 opacity-70" />
          </>
        )}
      </Button>

      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  )
}