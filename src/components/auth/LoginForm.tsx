"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authActions } from "@/lib/auth-client"
import { authStorage } from "@/lib/auth-storage"
import { Eye, EyeOff, Loader2, Mail, Lock, Coffee } from "lucide-react"
import { toast } from "sonner"
import { GitHubButton } from "./GitHubButton"

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo = "/dashboard" }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(authStorage.getRememberMe())
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required, like chai in the morning! ☕"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format! Try again, chef 👨‍🍳"
    }

    if (!formData.password) {
      newErrors.password = "Password is required! Don't leave the spice cabinet empty 🌶️"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password too weak! Needs more spice (8+ characters) 🔥"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const result = await authActions.signIn(formData.email, formData.password)
      
      if (result.success) {
        authStorage.setRememberMe(rememberMe)
        
        toast.success("Welcome back! The kitchen is ready for you 🍳", {
          description: "Redirecting to your spicy dashboard...",
        })
        
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 1000)
      } else {
        toast.error("Login Failed!", {
          description: result.error,
        })
        setErrors({ general: result.error || "Login failed" })
      }
    } catch (error) {
      toast.error("Oops! Something burned in the kitchen 🔥", {
        description: "Please try again in a moment",
      })
      setErrors({ general: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 text-2xl animate-bounce">🌶️</div>
        <div className="absolute top-40 right-20 w-8 h-8 text-2xl animate-bounce delay-300">🥭</div>
        <div className="absolute bottom-32 left-20 w-8 h-8 text-2xl animate-bounce delay-700">☕</div>
        <div className="absolute bottom-20 right-10 w-8 h-8 text-2xl animate-bounce delay-500">🧄</div>
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🥭</span>
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Welcome Back!
          </CardTitle>
          
          <CardDescription className="text-lg text-gray-600">
            Time to spice up your analytics! Log in to continue your flavor journey 🌶️
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* GitHub OAuth Section - Outside of form */}
          <div className="space-y-4">
            <GitHubButton 
              mode="signin" 
              redirectTo={redirectTo}
            />
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="chef@clickchutney.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className={`pl-10 h-12 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-orange-500'}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your secret spice blend..."
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  className={`pl-10 pr-12 h-12 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-orange-500'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">Remember this spice level</span>
              </label>
              
              <Link
                href="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Forgot recipe?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Cooking up your session...
                </>
              ) : (
                <>
                  <Coffee className="w-5 h-5 mr-2" />
                  Let's Get Cooking! 
                </>
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              New to the kitchen?{" "}
              <Link
                href="/register"
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Join our spicy community! 🌶️
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}