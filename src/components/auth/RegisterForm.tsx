"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils } from "lucide-react"
import { GitHubButton } from "./GitHubButton"
import { TwitterButton } from "./TwitterButton"

interface RegisterFormProps {
  redirectTo?: string
}

export function RegisterForm({ redirectTo = "/dashboard" }: RegisterFormProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#FFB800] rounded-full flex items-center justify-center">
            <Utensils className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-[#1F2937]">
          Join the Kitchen! 🍳
        </CardTitle>
        <CardDescription className="text-[#8B4513]">
          Sign up to start cooking with spicy analytics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <GitHubButton disabled={false} redirectTo={redirectTo} mode="signup" />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#8B4513]/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#8B4513]/60">or</span>
            </div>
          </div>
          
          <TwitterButton disabled={false} redirectTo={redirectTo} mode="signup" />
        </div>

        <div className="text-center">
          <p className="text-sm text-[#8B4513]/80 leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="font-semibold text-[#10B981] hover:text-[#FFB800] transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#10B981] hover:text-[#FFB800] transition-colors">
              Privacy Policy
            </Link>{" "}
            (No spam, we promise! 🙏)
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-[#8B4513]/80">
            Already have a kitchen?{" "}
            <Link 
              href="/login" 
              className="font-bold text-[#10B981] hover:text-[#FFB800] transition-colors"
            >
              Sign in here! 🚪
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}