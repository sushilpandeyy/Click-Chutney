"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Zap,
  Feather,
  TrendingUp,
  Users,
  Code,
  BarChart3,
  Sparkles,
  Star,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Shield,
  Rocket,
  Heart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { FloatingElements } from "@/components/floating-elements"
import { StatsSection } from "@/components/stats-section"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">🥭</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ClickChutney
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#pricing"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium relative group"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#blog"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium relative group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#login"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium relative group"
              >
                Login
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Get Started 🌶️
              </Button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-orange-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-orange-100 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col space-y-4">
                <Link href="#features" className="text-gray-700 hover:text-orange-600 font-medium px-2 py-1">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-700 hover:text-orange-600 font-medium px-2 py-1">
                  Pricing
                </Link>
                <Link href="#blog" className="text-gray-700 hover:text-orange-600 font-medium px-2 py-1">
                  Blog
                </Link>
                <Link href="#login" className="text-gray-700 hover:text-orange-600 font-medium px-2 py-1">
                  Login
                </Link>
                <Button className="bg-gradient-to-r from-green-600 to-green-700 text-white mx-2">Get Started 🌶️</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
        <FloatingElements />

        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f97316' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200 mb-8 text-sm font-medium px-4 py-2 hover:scale-105 transition-transform duration-300">
                🎉 Now serving fresh analytics to 10,000+ developers!
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Spice Up Your Site's{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 animate-gradient">
                  Analytics
                </span>{" "}
                with ClickChutney!
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                Deliciously simple, privacy-friendly analytics—served with extra flavor just for you.
                <span className="font-semibold text-orange-600"> No cookies needed</span>, just pure spicy insights! 🌶️
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl px-10 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  🥭 Start for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-red-500 text-red-600 hover:bg-red-50 text-xl px-10 py-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  See Live Demo 🌶️
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5 text-purple-600" />
                  <span>Lightning Fast</span>
                </div>
              </div>
            </div>

            <div className="relative lg:scale-110">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/placeholder.svg?height=600&width=700"
                  alt="ClickChutney analytics dashboard with Indian snacks theme"
                  width={700}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur-3xl opacity-20 -z-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-orange-100 text-orange-800 border-orange-200 mb-6 text-sm font-medium px-4 py-2">
              🚀 Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Features That Pack a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Punch</span>{" "}
              🥊
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Every feature is crafted with love, spices, and a deep understanding of what developers actually need. No
              bloat, just pure flavor!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time, Spicy Insights 🌶️</h3>
                <p className="text-gray-600 leading-relaxed">
                  Watch your data sizzle with live updates that are hotter than fresh samosas straight from the fryer!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Feather className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Light, Cookieless & Fast 🍃</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lighter than a papadum, faster than street food service, zero cookies required. Privacy-first
                  analytics!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gamified for Growth 🎮</h3>
                <p className="text-gray-600 leading-relaxed">
                  Level up your metrics like collecting different chutneys—sweet progress tracking with achievements!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Collaboration Feast 👥</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share the flavor! Collaborate like you're sharing a thali with your dev team. Everyone gets a taste!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200 mb-6 text-sm font-medium px-4 py-2">
              🍳 Simple Process
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              How to Cook Up{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
                Insights
              </span>{" "}
              👨‍🍳
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
              Three simple steps to get your analytics sizzling like a perfect dosa!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Code className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Add the Secret Sauce 🥄</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Drop our lightweight snippet into your site—easier than adding masala to dal! One line of code, infinite
                possibilities.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Watch the Magic Happen ✨</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Snackable charts appear instantly—your mango mascot will be cheering as data flows in real-time!
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Grow with Flavor 🚀</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Use insights to spice up your growth—celebrate milestones with digital confetti and achievement badges!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-green-100 text-green-800 border-green-200 mb-6 text-sm font-medium px-4 py-2">
              💬 Customer Love
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              What{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-red-500">
                Spicy Startups
              </span>{" "}
              Say 🌟
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed font-medium">
                  "ClickChutney made analytics actually fun! It's like having a party every time I check my dashboard.
                  The insights are as addictive as street food! 🎉"
                </p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Priya Sharma</p>
                    <p className="text-gray-600">Founder, SpiceBox</p>
                    <p className="text-sm text-orange-600 font-medium">🚀 Series A Startup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed font-medium">
                  "Finally, analytics that don't put me to sleep! The Indian snack theme is genius. My team actually
                  fights over who gets to check the metrics first! 🥭"
                </p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Raj Patel</p>
                    <p className="text-gray-600">CTO, ChaiTech</p>
                    <p className="text-sm text-green-600 font-medium">💰 Profitable SaaS</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed font-medium">
                  "Privacy-friendly and delicious UX. My team actually looks forward to checking metrics now! It's like
                  unwrapping a gift every time. 🌶️"
                </p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Anita Kumar</p>
                    <p className="text-gray-600">Lead Dev, MasalaMetrics</p>
                    <p className="text-sm text-red-600 font-medium">🏆 Y Combinator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-orange-100 text-orange-800 border-orange-200 mb-6 text-sm font-medium px-4 py-2">
              ❓ Got Questions?
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Flavors 🤔</h2>
            <p className="text-xl text-gray-600">Everything you need to know about getting started with ClickChutney</p>
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">🥭</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Is ClickChutney really cookieless?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We're as cookieless as a fresh mango! We respect privacy like we respect good food—completely! Our
                      analytics work without any cookies, using privacy-first techniques that comply with GDPR, CCPA,
                      and other regulations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">🌶️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">How spicy is the learning curve?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Mild as lassi! If you can add a script tag, you can use ClickChutney. Setup takes less time than
                      making instant noodles. Our documentation is as clear as our analytics, with step-by-step guides
                      and video tutorials.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">🍛</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Can I customize the dashboard flavors?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Of course! Mix and match widgets like creating your perfect thali. Sweet, spicy, or mild—your
                      choice! Customize colors, layouts, and even add your own branding. Make it taste just right for
                      your team.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">What about performance impact?</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Lighter than a papadum! Our script is under 2KB gzipped and loads asynchronously. Your site will
                      stay as fast as a street food vendor during lunch rush. Zero impact on your Core Web Vitals!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Add Some Spice to Your Analytics? 🔥
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
            Join thousands of developers who've already discovered the secret sauce to better insights! Start your free
            trial today—no credit card required, just pure analytics goodness.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-12 py-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
            >
              🥭 Get Tasting for Free
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-xl px-12 py-6 bg-transparent backdrop-blur-sm shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              📞 Talk to Our Chefs
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-orange-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">🥭</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ClickChutney
                </span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md text-lg leading-relaxed">
                Made with <Heart className="w-5 h-5 text-red-500 inline mx-1" />, spices, and Next.js by a team that
                believes analytics should be as delightful as street food.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-lg">🐦</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-lg">💼</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-lg">📚</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-600 transition-colors font-medium">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-200 mt-12 pt-8 text-center text-gray-600">
            <p className="text-lg">
              &copy; 2024 ClickChutney. All rights reserved. Served fresh daily with extra love! 🌶️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
