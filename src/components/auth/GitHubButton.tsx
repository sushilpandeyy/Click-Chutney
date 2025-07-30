"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { authActions } from "@/lib/auth-client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface GitHubButtonProps {
  disabled?: boolean
  redirectTo?: string
  mode?: "signin" | "signup"
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline"
}

export function GitHubButton({
  disabled = false,
  redirectTo = "/dashboard",
  mode = "signin",
  className,
  size = "lg",
  variant = "default"
}: GitHubButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGitHubSignIn = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await authActions.signInWithGitHub(redirectTo)

      if (result.success) {
        toast.success("🎉 GitHub Connected!", {
          description: "Redirecting to your dashboard...",
        })
      } else {
        throw new Error(result.error || "GitHub authentication failed")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "GitHub authentication failed"
      setError(errorMessage)

      toast.error("Authentication Failed!", {
        description: errorMessage,
      })

      setIsLoading(false)
    }
  }

  const buttonText = mode === "signin" ? "Sign in with GitHub" : "Sign up with GitHub"
  const loadingText = "Connecting to GitHub..."

  const baseStyles = variant === "outline"
    ? "border-2 border-[#24292e] text-[#24292e] hover:bg-[#24292e] hover:text-white"
    : "bg-[#24292e] hover:bg-[#1a1e22] text-white"

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleGitHubSignIn}
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
            <Github className="w-5 h-5 mr-3" />
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
