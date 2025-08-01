// src/app/(auth)/layout.tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClickChutney - Analytics Made Delicious',
  description: 'Join thousands of developers who love ClickChutney - privacy-first web analytics with flavor.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
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

            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Background with floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        
        {/* Floating elements */}
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

      {/* Main content */}
      <div className="relative z-10 pt-16">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground">
          Made with 🌶️ and Next.js by developers who care about privacy
        </p>
      </div>
    </div>
  )
}