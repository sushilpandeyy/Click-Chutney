"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Zap,
  Shield,
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
  Rocket,
  Heart,
  Globe,
  Activity,
  Database,
  Lock,
  ChevronDown,
  Github,
  Twitter,
  Mail
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-bold text-lg">🥭</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                ClickChutney
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-foreground/70 hover:text-foreground transition-colors font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#pricing"
                className="text-foreground/70 hover:text-foreground transition-colors font-medium relative group"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#faq"
                className="text-foreground/70 hover:text-foreground transition-colors font-medium relative group"
              >
                FAQ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/login"
                className="text-foreground/70 hover:text-foreground transition-colors font-medium"
              >
                Login
              </Link>
              <Button asChild className="shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
              <div className="flex flex-col space-y-4">
                <Link href="#features" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1">
                  Features
                </Link>
                <Link href="#pricing" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1">
                  Pricing
                </Link>
                <Link href="#faq" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1">
                  FAQ
                </Link>
                <Link href="/login" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1">
                  Login
                </Link>
                <Button asChild className="mx-2">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 animate-float">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl shadow-lg">
              🥭
            </div>
          </div>
          <div className="absolute bottom-32 left-16 animate-float-delayed">
            <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center text-xl shadow-lg">
              🌶️
            </div>
          </div>
          <div className="absolute top-1/2 left-8 animate-float-slow">
            <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center text-xl shadow-lg">
              🥟
            </div>
          </div>
          <div className="absolute top-1/3 right-20 animate-bounce-slow">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-lg shadow-lg">
              🌿
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-8 text-sm font-medium px-4 py-2">
                🎉 Trusted by 10,000+ developers worldwide
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                Analytics Made{" "}
                <span className="text-primary animate-pulse">
                  Delicious
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                Privacy-first web analytics with the flavor of Indian street food. 
                <span className="text-primary font-semibold"> No cookies needed</span>, 
                just pure insights! 🌶️
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
                <Button
                  size="lg"
                  asChild
                  className="text-xl px-10 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Link href="/dashboard">
                    🥭 Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-10 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  View Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>2KB Script</span>
                </div>
              </div>
            </div>

            <div className="relative lg:scale-110">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-primary" />
                      Live Analytics Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">2,847</div>
                        <div className="text-sm text-muted-foreground">Today's Visits</div>
                      </div>
                      <div className="bg-green-500/10 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">98.9%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                    </div>
                    <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-muted-foreground">📊 Real-time Chart Preview</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  10K+
                </div>
                <p className="text-muted-foreground font-medium">Happy Developers</p>
                <p className="text-sm text-muted-foreground/70">Loving the spice!</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl lg:text-4xl font-bold text-green-500 mb-2">
                  99.9%
                </div>
                <p className="text-muted-foreground font-medium">Uptime</p>
                <p className="text-sm text-muted-foreground/70">Rock solid!</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl lg:text-4xl font-bold text-yellow-500 mb-2">
                  50ms
                </div>
                <p className="text-muted-foreground font-medium">Load Time</p>
                <p className="text-sm text-muted-foreground/70">Lightning fast!</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-500 mb-2">
                  24/7
                </div>
                <p className="text-muted-foreground font-medium">Support</p>
                <p className="text-sm text-muted-foreground/70">Always here!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 text-sm font-medium px-4 py-2">
              🚀 Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Features That Pack a{" "}
              <span className="text-primary">Punch</span>
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Every feature is crafted with love, spices, and a deep understanding of what developers actually need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <Activity className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Real-time Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Watch your data update live as visitors interact with your site. No delays, just pure real-time analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Zero cookies, GDPR compliant by design. Respect your users' privacy while getting the insights you need.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-10 h-10 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  2KB script that loads asynchronously. Zero impact on your site's performance or Core Web Vitals.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <Users className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Share insights with your team. Role-based access, comments, and collaborative analysis features.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <Database className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Data Export</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Export your data in CSV, JSON, or Excel formats. Your data, your rules, your analysis tools.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                  <Code className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Easy Integration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  One-line script or React component. Works with any framework. Setup takes less than 2 minutes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 text-sm font-medium px-4 py-2">
              💰 Simple Pricing
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Choose Your{" "}
              <span className="text-primary">Flavor</span>
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Start free, upgrade when you need more spice. No hidden costs, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold mb-2">Free</div>
                  <div className="text-4xl font-bold mb-4">$0</div>
                  <div className="text-muted-foreground">Forever free</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Up to 10K events/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>3 projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>30 days data retention</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6" asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-primary/5 border-primary/50 hover:border-primary transition-all duration-300 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold mb-2">Pro</div>
                  <div className="text-4xl font-bold mb-4">$29</div>
                  <div className="text-muted-foreground">per month</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Up to 100K events/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>5 team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>1 year data retention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/dashboard">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Business Tier */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold mb-2">Business</div>
                  <div className="text-4xl font-bold mb-4">$99</div>
                  <div className="text-muted-foreground">per month</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Up to 1M events/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Advanced analytics + API</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Unlimited data retention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6" asChild>
                  <Link href="/dashboard">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 text-sm font-medium px-4 py-2">
              ❓ Got Questions?
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about ClickChutney</p>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xl">🥭</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Is ClickChutney really cookieless?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes! We respect privacy completely. Our analytics work without any cookies, using privacy-first 
                      techniques that comply with GDPR, CCPA, and other regulations. No consent banners needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-green-500 text-xl">🌶️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">How easy is it to set up?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Super easy! Add one script tag or install our React component. Setup takes less than 2 minutes. 
                      Our documentation includes step-by-step guides and video tutorials.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-500 text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Will it slow down my website?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Not at all! Our script is only 2KB gzipped and loads asynchronously. Zero impact on your 
                      Core Web Vitals or site performance. Your site stays lightning fast.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-500 text-xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Can I export my data?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Absolutely! Your data belongs to you. Export in CSV, JSON, or Excel formats anytime. 
                      Use it with your favorite analysis tools or just for backup purposes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
            Ready to Spice Up Your Analytics?
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed">
            Join thousands of developers who've discovered the secret sauce to better insights! 
            Start your free trial today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              asChild
              className="text-xl px-12 py-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
            >
              <Link href="/dashboard">
                🥭 Start Free Trial
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-12 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              📞 Talk to Sales
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-xl">🥭</span>
                </div>
                <span className="text-2xl font-bold">ClickChutney</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md text-lg leading-relaxed">
                Privacy-first web analytics made delicious. Built with{" "}
                <Heart className="w-5 h-5 text-red-500 inline mx-1" /> 
                and Next.js by developers who care about privacy and great UX.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="rounded-full">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="outline" className="rounded-full">
                  <Github className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="outline" className="rounded-full">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-foreground transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p className="text-lg">
              &copy; 2024 ClickChutney. All rights reserved. Made with extra spice! 🌶️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}