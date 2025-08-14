'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && !isPending) {
      router.push('/dashboard');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Auth buttons in top right */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Sign in
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Sign up
        </button>
      </div>

      {/* Shadcn-inspired gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-almost-black via-lifted-panels to-almost-black"></div>
      
      {/* Subtle background blur effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Shadcn-style glass card container */}
        <div className="backdrop-blur-xl bg-surface border border-separator rounded-3xl p-12 shadow-2xl animate-[fade-in-up_1s_ease-out_forwards]">
          
          {/* Main heading */}
          <div className="mb-12">
            <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-8 animate-[float_3s_ease-in-out_infinite] bg-gradient-to-r from-near-white via-muted-gray to-near-white bg-clip-text text-transparent break-words">
              ClickChutney
            </h1>
            
            {/* Subtle accent line */}
            <div className="w-40 h-1 bg-gradient-to-r from-blue via-emerald to-blue mx-auto rounded-full mb-10 animate-[glow-pulse_4s_ease-in-out_infinite] shadow-lg shadow-blue/50"></div>
          </div>
          
          {/* Content */}
          <div className="mb-16">
            <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 animate-[fade-in-up_1s_ease-out_0.2s_forwards] opacity-0">
              Modern Analytics Platform
            </p>
            
            {/* Coming Soon with Shadcn styling */}
            <div className="inline-block backdrop-blur-md bg-muted-background/50 border border-separator rounded-2xl px-8 py-4 animate-[fade-in-up_1s_ease-out_0.4s_forwards] opacity-0">
              <h2 className="font-poppins text-3xl md:text-4xl font-semibold text-foreground">
                Coming Soon
              </h2>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fade-in-up_1s_ease-out_0.6s_forwards] opacity-0 mb-8">
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-3 border border-separator hover:bg-surface text-foreground rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Shadcn-style loading indicators */}
          <div className="flex justify-center items-center space-x-4 animate-[fade-in-up_1s_ease-out_0.8s_forwards] opacity-0">
            <div className="w-3 h-3 rounded-full bg-blue animate-[glow-pulse_2s_ease-in-out_infinite] shadow-lg shadow-blue/50"></div>
            <div className="w-4 h-4 rounded-full bg-emerald animate-[glow-pulse_2s_ease-in-out_infinite] shadow-lg shadow-emerald/50" style={{animationDelay: '0.2s'}}></div>
            <div className="w-5 h-5 rounded-full bg-yellow animate-[glow-pulse_2s_ease-in-out_infinite] shadow-lg shadow-yellow/50" style={{animationDelay: '0.4s'}}></div>
            <div className="w-4 h-4 rounded-full bg-red animate-[glow-pulse_2s_ease-in-out_infinite] shadow-lg shadow-red/50" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
      </div>

      {/* Shadcn-style floating elements */}
      <div className="absolute top-20 left-20 w-6 h-6 rounded-full bg-blue/10 backdrop-blur-sm border border-separator animate-[float_4s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-32 right-20 w-8 h-8 rounded-full bg-emerald/10 backdrop-blur-sm border border-separator animate-[float_5s_ease-in-out_infinite]"></div>
      <div className="absolute top-1/3 right-16 w-4 h-4 rounded-full bg-yellow/10 backdrop-blur-sm border border-separator animate-[float_3.5s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/3 left-16 w-5 h-5 rounded-full bg-red/10 backdrop-blur-sm border border-separator animate-[float_4.5s_ease-in-out_infinite]"></div>
    </div>
  );
}
