"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat } from "lucide-react"
import { GitHubButton } from "./GitHubButton"

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo = "/dashboard" }: LoginFormProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFB800] to-[#FF4444] rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-[#1F2937]">
          Welcome to the Kitchen! 👨‍🍳
        </CardTitle>
        <CardDescription className="text-[#8B4513]">
          Sign in with GitHub to start cooking with spicy analytics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <GitHubButton disabled={false} redirectTo={redirectTo} />

        <div className="text-center">
          <p className="text-sm text-[#8B4513]/80">
            By signing in, you agree to our{" "}
            <Link 
              href="/terms" 
              className="font-bold text-[#FFB800] hover:text-[#FF4444] transition-colors"
            >
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link 
              href="/privacy" 
              className="font-bold text-[#FFB800] hover:text-[#FF4444] transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}