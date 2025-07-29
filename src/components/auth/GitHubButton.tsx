"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, Loader2 } from "lucide-react"
import { authActions } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface GitHubButtonProps {
  mode?: "signin" | "signup"
  redirectTo?: string
  className?: string
}

export function GitHubButton({ 
  mode = "signin", 
  redirectTo = "/dashboard",
  className 
}: GitHubButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGitHubAuth = async () => {
    try {
      setIsLoading(true)
      
      const result = await authActions.signInWithGitHub()
      
      if (result.success) {
        toast.success("🎉 Welcome to the kitchen, chef!", {
          description: "You've successfully signed in with GitHub!"
        })
        
        // Redirect after successful authentication
        router.push(redirectTo)
      } else {
        toast.error("GitHub Sign-in Failed", {
          description: result.error
        })
      }
    } catch (error) {
      toast.error("Connection Error", {
        description: "Failed to connect with GitHub. Try again!"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGitHubAuth}
      disabled={isLoading}
      className={`
        w-full border-gray-300 hover:border-gray-400 
        bg-white hover:bg-gray-50 text-gray-900
        dark:bg-gray-800 dark:hover:bg-gray-700 
        dark:text-white dark:border-gray-600
        transition-all duration-200 ease-in-out
        hover:shadow-md active:scale-[0.98]
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting to GitHub...
        </>
      ) : (
        <>
          <Github className="mr-2 h-4 w-4" />
          {mode === "signin" ? "Sign in" : "Sign up"} with GitHub
        </>
      )}
    </Button>
  )
}