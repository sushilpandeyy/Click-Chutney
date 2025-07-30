"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, Loader2, Sparkles } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { toast } from "sonner"

interface GitHubButtonProps {
  disabled?: boolean
  redirectTo?: string
  mode?: "signin" | "signup"
}

export function GitHubButton({ 
  disabled = false, 
  redirectTo = "/dashboard",
  mode = "signin" 
}: GitHubButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubSignIn = async () => {
    if (disabled || isLoading) return
    
    setIsLoading(true)
    
    try {
      await signIn.social({
        provider: "github",
        callbackURL: redirectTo,
      })
      
      toast.success("🎉 Redirecting to GitHub!", {
        description: "Sign in with your GitHub account to continue",
      })
    } catch (error) {
      console.error('GitHub auth error:', error)
      toast.error("Connection Failed!", {
        description: "Unable to connect with GitHub. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const buttonText = mode === "signin" ? "Sign in with GitHub" : "Sign up with GitHub"
  const loadingText = "Connecting to GitHub..."

  return (
    <Button
      type="button"
      onClick={handleGitHubSignIn}
      disabled={disabled || isLoading}
      size="lg"
      className="w-full h-14 bg-[#24292e] hover:bg-[#1a1e22] text-white font-semibold text-base rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-0"
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
  )
}