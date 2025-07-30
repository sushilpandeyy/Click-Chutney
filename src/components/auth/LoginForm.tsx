"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authActions } from "@/lib/auth-client"
import { authStorage } from "@/lib/auth-storage"
import { Eye, EyeOff, Loader2, Mail, Lock, Coffee, ChefHat } from "lucide-react"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
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
      toast.error("Oops! Kitchen's having a moment 🔥", {
        description: "Something went wrong. Try again!",
      })
      setErrors({ general: "Login failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFB800] to-[#FF4444] rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-[#1F2937]">
          Welcome back, Chef! 👨‍🍳
        </CardTitle>
        <CardDescription className="text-[#8B4513]">
          Ready to cook up some spicy analytics?
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {errors.general && (
          <div className="p-3 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/20">
            <p className="text-sm text-[#FF4444] font-medium">{errors.general}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#8B4513]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/60 w-5 h-5" />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`pl-10 h-12 border-2 transition-all duration-200 bg-white/80 ${
                  errors.email 
                    ? "border-[#FF4444] focus:border-[#FF4444]" 
                    : "border-[#8B4513]/20 focus:border-[#FFB800] hover:border-[#FFB800]/60"
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-[#FF4444] font-medium mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#8B4513]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/60 w-5 h-5" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your secret recipe"
                className={`pl-10 pr-12 h-12 border-2 transition-all duration-200 bg-white/80 ${
                  errors.password 
                    ? "border-[#FF4444] focus:border-[#FF4444]" 
                    : "border-[#8B4513]/20 focus:border-[#FFB800] hover:border-[#FFB800]/60"
                }`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#FFB800]/20"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#8B4513]/60" />
                ) : (
                  <Eye className="w-4 h-4 text-[#8B4513]/60" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-[#FF4444] font-medium mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#FFB800] border-2 border-[#8B4513]/20 rounded focus:ring-[#FFB800] focus:ring-2"
              disabled={isLoading}
            />
            <span className="text-sm text-[#8B4513] font-medium">Remember me</span>
          </label>
          <Link 
            href="/forgot-password" 
            className="text-sm text-[#FFB800] hover:text-[#FF4444] font-semibold transition-colors"
          >
            Forgot recipe? 🤔
          </Link>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-[#FFB800] to-[#FF4444] hover:from-[#FF4444] hover:to-[#FFB800] text-white font-bold text-base rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Cooking up access... 🍳
            </>
          ) : (
            <>
              <Coffee className="w-5 h-5 mr-2" />
              Enter the Kitchen! 🔥
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#8B4513]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-[#8B4513]/60 font-medium">
              Or spice it up with
            </span>
          </div>
        </div>

        <GitHubButton disabled={isLoading} />

        <div className="text-center">
          <p className="text-sm text-[#8B4513]/80">
            New to the kitchen?{" "}
            <Link 
              href="/register" 
              className="font-bold text-[#FFB800] hover:text-[#FF4444] transition-colors"
            >
              Join the crew! 👥
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}