"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authActions } from "@/lib/auth-client"
import { Eye, EyeOff, Loader2, Mail, Lock, User, ChefHat, Utensils } from "lucide-react"
import { toast } from "sonner"
import { GitHubButton } from "./GitHubButton"

interface RegisterFormProps {
  redirectTo?: string
}

export function RegisterForm({ redirectTo = "/dashboard" }: RegisterFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required! Every chef needs a name 👨‍🍳"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name too short! Even street food vendors have longer names 🍜"
    }

    if (!formData.email) {
      newErrors.email = "Email is required, like masala in biryani! 🍛"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format! Try again, future chef 👨‍🍳"
    }

    if (!formData.password) {
      newErrors.password = "Password is required! Secure your recipe vault 🔐"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password needs more spice! At least 8 characters 🌶️"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password needs variety! Mix uppercase, lowercase & numbers like a good curry 🍛"
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
      const result = await authActions.signUp(formData.email, formData.password, formData.name)
      
      if (result.success) {
        toast.success("Welcome to the kitchen! 🍳", {
          description: "Your account is ready! Time to start cooking with data...",
        })
        
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 1000)
      } else {
        toast.error("Registration Failed!", {
          description: result.error,
        })
        setErrors({ general: result.error || "Registration failed" })
      }
    } catch (error) {
      toast.error("Oops! Kitchen's having a moment 🔥", {
        description: "Something went wrong. Try again!",
      })
      setErrors({ general: "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

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
              Chef Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/60 w-5 h-5" />
              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="What should we call you?"
                className={`pl-10 h-12 border-2 transition-all duration-200 bg-white/80 ${
                  errors.name 
                    ? "border-[#FF4444] focus:border-[#FF4444]" 
                    : "border-[#8B4513]/20 focus:border-[#10B981] hover:border-[#10B981]/60"
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-[#FF4444] font-medium mt-1">{errors.name}</p>
            )}
          </div>

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
                    : "border-[#8B4513]/20 focus:border-[#10B981] hover:border-[#10B981]/60"
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
              Secret Recipe (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/60 w-5 h-5" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create your secret recipe"
                className={`pl-10 pr-12 h-12 border-2 transition-all duration-200 bg-white/80 ${
                  errors.password 
                    ? "border-[#FF4444] focus:border-[#FF4444]" 
                    : "border-[#8B4513]/20 focus:border-[#10B981] hover:border-[#10B981]/60"
                }`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#10B981]/20"
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

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            required
            className="w-4 h-4 mt-1 text-[#10B981] border-2 border-[#8B4513]/20 rounded focus:ring-[#10B981] focus:ring-2"
            disabled={isLoading}
          />
          <label className="text-sm text-[#8B4513] leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-[#10B981] hover:text-[#FFB800] transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#10B981] hover:text-[#FFB800] transition-colors">
              Privacy Policy
            </Link>{" "}
            (No spam, we promise! 🙏)
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-[#10B981] to-[#FFB800] hover:from-[#FFB800] hover:to-[#10B981] text-white font-bold text-base rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Preparing your kitchen... 🍳
            </>
          ) : (
            <>
              <ChefHat className="w-5 h-5 mr-2" />
              Start Cooking! 🔥
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#8B4513]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-[#8B4513]/60 font-medium">
              Or join with
            </span>
          </div>
        </div>

        <GitHubButton disabled={isLoading} />

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