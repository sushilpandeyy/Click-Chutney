// src/app/(auth)/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClickChutney - Spicy Simple Analytics',
  description: 'Join the kitchen! Sign up for ClickChutney and start cooking up spicy analytics.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF7E0] via-[#FFFFFF] to-[#10B981]/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated spice particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#FF4444] rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#FFB800] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-[#10B981] rounded-full animate-bounce opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-[#FF4444] rounded-full animate-pulse opacity-30" style={{ animationDelay: '2s' }}></div>
        
        {/* Large background shapes */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFB800]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#10B981]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-[#8B4513]/60">
          Made with 🌶️ and lots of ☕ by the ClickChutney team
        </p>
      </div>
    </div>
  )
}