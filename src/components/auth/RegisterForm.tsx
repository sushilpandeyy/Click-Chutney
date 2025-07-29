"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authActions } from "@/lib/auth-client"
import { Eye, EyeOff, Loader2, Mail, Lock, User, ChefHat, Check } from "lucide-react"
import { toast } from "sonner"

interface RegisterFormProps {
  redirectTo?: string
}

export function RegisterForm({ redirectTo = "/dashboard" }: RegisterFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)

   
  const checkPasswordStrength = (password: string) => {
    const checks = [
      { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
      { label: "Contains uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
      { label: "Contains lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
      { label: "Contains number", test: (pwd: string) => /\d/.test(pwd) },
      { label: "Contains special character", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
    ]
    
    return checks.map(check => ({
      ...check,
      passed: check.test(password)
    }))
  }

  const passwordStrength = checkPasswordStrength(formData.password)
  const strongPassword = passwordStrength.filter(check => check.passed).length >= 3

 
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required! Every chef needs a name 👨‍🍳"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name too short! Like a mini samosa 🥟"
    }

    if (!formData.email) {
      newErrors.email = "Email is required, like masala in curry! 🍛"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format! Try again, chef 👨‍🍳"
    }

    if (!formData.password) {
      newErrors.password = "Password is required! Protect your secret recipes 📖"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password needs more spice! At least 8 characters 🌶️"
    } else if (!strongPassword) {
      newErrors.password = "Password needs more ingredients! Mix uppercase, lowercase, numbers 🔥"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your secret recipe! 🔐"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match! Like oil and water 💧"
    }

    if (!agreedToTerms) {
      newErrors.terms = "Please agree to our kitchen rules! 📋"
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
      const result = await authActions.signUp(
        formData.email,
        formData.password,
        formData.name.trim()
      )
      
      if (result.success) {
        toast.success("Welcome to the kitchen! 🍳", {
          description: "Your account is ready. Let's start cooking up some analytics!",
        })
        
    
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 1500)
      } else {
        toast.error("Registration Failed!", {
          description: result.error,
        })
        setErrors({ general: result.error || "Registration failed" })
      }
    } catch (error) {
      toast.error("Oops! The kitchen is a bit busy 🔥", {
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
        <div className="absolute top-20 left-10 w-8 h-8 text-2xl animate-bounce">🌿</div>
        <div className="absolute top-40 right-20 w-8 h-8 text-2xl animate-bounce delay-300">🧄</div>
        <div className="absolute bottom-32 left-20 w-8 h-8 text-2xl animate-bounce delay-700">🌶️</div>
        <div className="absolute bottom-20 right-10 w-8 h-8 text-2xl animate-bounce delay-500">🥭</div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 text-2xl animate-bounce delay-1000">🍯</div>
      </div>

      <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
           
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🥭</span>
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            Join the Kitchen!
          </CardTitle>
          
          <CardDescription className="text-lg text-gray-600">
            Ready to cook up some spicy analytics? Let's get you started! 🔥
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
           
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

           
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Chef Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Master Chef"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className={`pl-10 h-12 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-green-500'}`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            
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
                  className={`pl-10 h-12 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-green-500'}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

           
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Secret Recipe (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your secret spice blend..."
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  className={`pl-10 pr-12 h-12 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-green-500'}`}
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
              
              
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-full h-2 rounded-full ${
                      strongPassword ? 'bg-green-200' : 'bg-red-200'
                    }`}>
                      <div className={`h-full rounded-full transition-all duration-300 ${
                        strongPassword ? 'bg-green-500' : 'bg-red-500'
                      }`} style={{ 
                        width: `${(passwordStrength.filter(check => check.passed).length / passwordStrength.length) * 100}%` 
                      }} />
                    </div>
                    <span className={`text-xs font-medium ${
                      strongPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {strongPassword ? 'Strong! 🔥' : 'Weak 😴'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    {passwordStrength.map((check, index) => (
                      <div key={index} className={`flex items-center space-x-2 ${
                        check.passed ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <Check className={`w-3 h-3 ${check.passed ? 'opacity-100' : 'opacity-30'}`} />
                        <span>{check.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Secret Recipe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your secret blend..."
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  className={`pl-10 pr-12 h-12 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-green-500'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            
            <div className="space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium">
                    Kitchen Rules (Terms of Service)
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium">
                    Recipe Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
              )}
            </div>
 
            <Button
              type="submit"
              disabled={isLoading || !strongPassword}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Preparing your kitchen...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5 mr-2" />
                  Start Cooking! 🔥
                </>
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already a master chef?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Return to your kitchen! 👨‍🍳
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}