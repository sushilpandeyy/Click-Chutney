"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"
import { GitHubButton } from "./GitHubButton"
import { TwitterButton } from "./TwitterButton"

interface RegisterFormProps {
  redirectTo?: string
}

export function RegisterForm({ redirectTo = "/dashboard" }: RegisterFormProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Badge */}
      <div className="text-center">
        <Badge className="mb-6 text-sm font-medium px-4 py-2">
          🚀 Join 10,000+ developers
        </Badge>
      </div>

      <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold mb-2">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Start your journey with privacy-first web analytics
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <GitHubButton disabled={false} redirectTo={redirectTo} mode="signup" />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            <TwitterButton disabled={false} redirectTo={redirectTo} mode="signup" />
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link 
                href="/terms" 
                className="font-medium text-primary hover:underline transition-colors"
              >
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link 
                href="/privacy" 
                className="font-medium text-primary hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}