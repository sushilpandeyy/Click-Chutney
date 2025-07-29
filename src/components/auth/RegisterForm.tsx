"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authActions } from "@/lib/auth-client"
import { Eye, EyeOff, Loader2, Mail, Lock, User, ChefHat } from "lucide-react"
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
      toast.error("Oops! The kitchen caught fire 🔥", {
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
      {/* Floating Spice Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 text-2xl animate-bounce">🌶️</div>
        <div className="absolute top-40 right-20 w-8 h-8 text-2xl animate-bounce delay-300">🥭</div>
        <div className="absolute bottom-32 left-20 w-8 h-8 text-2xl animate-bounce delay-700">☕</div>
        <div className="absolute bottom-20 right-10 w-8 h-8 text-2xl animate-bounce delay-500">🧄</div>
        <div className="absolute top-60 left-1/4 w-8 h-8 text-2xl animate-bounce delay-1000">🍛</div>
        <div className="absolute bottom-60 right-1/4 w-8 h-8 text-2xl animate-bounce delay-200">🔥</div>
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🥭</span>
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Join the Kitchen!
          </CardTitle>
          
          <CardDescription className="text-lg text-gray-600">
            Ready to spice up your analytics game? Let's get you cooking with data! 🌶️
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* GitHub OAuth Section - Outside of form */}
          <div className="space-y-4">
            <GitHubButton 
              mode="signup" 
              redirectTo={redirectTo}
            />
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or create account with email
                </span>
              </div>
            </div>
          </div>

          {/* Email/Password Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Master Chef Raman"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className={`pl-10 h-12 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-orange-500'}`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
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
              <p className="text-xs text-gray-500 mt-1">
                Use 8+ characters with uppercase, lowercase & numbers for extra spice! 🌶️
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-0.5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to ClickChutney's{" "}
                <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Preparing your kitchen...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5 mr-2" />
                  Start Cooking! 
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Already a chef in our kitchen?{" "}
              <Link
                href="/login"
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Sign in to start cooking! 🍳
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}