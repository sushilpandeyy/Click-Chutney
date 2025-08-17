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
      {/* Navigation buttons in top right */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <button
          onClick={() => router.push('/fonts')}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 font-medium"
        >
          Fonts
        </button>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 font-medium"
        >
          Sign in
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
        >
          Sign up
        </button>
      </div>

      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-muted"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-[fade-in_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl animate-[fade-in_8s_ease-in-out_infinite]" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-chart-3/5 rounded-full blur-3xl animate-[fade-in_7s_ease-in-out_infinite]" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Professional Glass Card */}
        <div className="backdrop-blur-xl bg-card border border-border rounded-3xl p-12 shadow-xl animate-[slide-up_0.6s_ease-out] bg-gradient-to-br from-card/90 via-card/95 to-muted/90">
          
          {/* Main heading */}
          <div className="mb-12">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-8 bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent break-words">
              ClickChutney
            </h1>
            
            {/* Professional Accent Line */}
            <div className="w-40 h-1 bg-gradient-to-r from-primary via-chart-1 to-chart-2 mx-auto rounded-full mb-10 shadow-lg shadow-primary/30"></div>
          </div>
          
          {/* Content */}
          <div className="mb-16">
            <p className="text-xl md:text-2xl text-muted-foreground font-serif font-medium mb-12 animate-[slide-up_0.8s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
              Modern Analytics Platform
            </p>
            
            {/* Coming Soon */}
            <div className="inline-block backdrop-blur-md bg-muted/30 border border-primary/20 rounded-2xl px-8 py-4 animate-[slide-up_0.8s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards] shadow-lg">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                Coming Soon
              </h2>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[slide-up_0.8s_ease-out_0.6s] opacity-0 [animation-fill-mode:forwards] mb-8">
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-display"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-3 border-2 border-border hover:bg-muted text-foreground rounded-xl font-semibold transition-all duration-200 hover:scale-105 font-display"
            >
              Sign In
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center items-center space-x-4 animate-[slide-up_0.8s_ease-out_0.8s] opacity-0 [animation-fill-mode:forwards]">
            <div className="w-3 h-3 rounded-full bg-chart-1 animate-pulse shadow-lg shadow-chart-1/50"></div>
            <div className="w-4 h-4 rounded-full bg-chart-2 animate-pulse shadow-lg shadow-chart-2/50" style={{animationDelay: '0.2s'}}></div>
            <div className="w-5 h-5 rounded-full bg-chart-3 animate-pulse shadow-lg shadow-chart-3/50" style={{animationDelay: '0.4s'}}></div>
            <div className="w-4 h-4 rounded-full bg-chart-4 animate-pulse shadow-lg shadow-chart-4/50" style={{animationDelay: '0.6s'}}></div>
            <div className="w-3 h-3 rounded-full bg-chart-5 animate-pulse shadow-lg shadow-chart-5/50" style={{animationDelay: '0.8s'}}></div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-6 h-6 rounded-full bg-primary/15 backdrop-blur-sm border border-primary/20 animate-pulse shadow-lg shadow-primary/20"></div>
      <div className="absolute bottom-32 right-20 w-8 h-8 rounded-full bg-chart-2/15 backdrop-blur-sm border border-chart-2/30 animate-pulse shadow-lg shadow-chart-2/20" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-16 w-4 h-4 rounded-full bg-chart-3/15 backdrop-blur-sm border border-chart-3/30 animate-pulse shadow-lg shadow-chart-3/20" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/3 left-16 w-5 h-5 rounded-full bg-chart-4/15 backdrop-blur-sm border border-chart-4/30 animate-pulse shadow-lg shadow-chart-4/20" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-2/3 left-1/4 w-3 h-3 rounded-full bg-chart-5/15 backdrop-blur-sm border border-chart-5/30 animate-pulse shadow-lg shadow-chart-5/20" style={{animationDelay: '4s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-7 h-7 rounded-full bg-chart-1/15 backdrop-blur-sm border border-chart-1/30 animate-pulse shadow-lg shadow-chart-1/20" style={{animationDelay: '5s'}}></div>
    </div>
  );
}
