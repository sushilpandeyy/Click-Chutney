"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, Loader2 } from "lucide-react"
import { authActions } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface GitHubButtonProps {
  disabled?: boolean
  redirectTo?: string
}

export function GitHubButton({ disabled = false, redirectTo = "/dashboard" }: GitHubButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    
    try {
      const result = await authActions.signInWithGitHub()
      
      if (result.success) {
        toast.success("GitHub sign-in successful! 🎉", {
          description: "Welcome to the kitchen!",
        })
        
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 1000)
      } else {
        toast.error("GitHub sign-in failed", {
          description: result.error || "Something went wrong",
        })
      }
    } catch (error) {
      toast.error("Connection failed!", {
        description: "Unable to connect with GitHub. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGitHubSignIn}
      disabled={disabled || isLoading}
      className="w-full h-12 border-2 border-[#8B4513]/20 hover:border-[#8B4513]/40 hover:bg-[#8B4513]/5 transition-all duration-200"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Connecting...
        </>
      ) : (
        <>
          <Github className="w-5 h-5 mr-2" />
          Continue with GitHub
        </>
      )}
    </Button>
  )
}