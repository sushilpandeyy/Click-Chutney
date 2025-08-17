'use client';

import { signIn } from '@/lib/auth-client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SignUpContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle error parameters from OAuth callback
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'access_denied': 'You denied access to GitHub. Please try again.',
        'missing_code': 'Authorization code was missing. Please try again.',
        'auth_failed': 'Authentication failed. Please try again.',
        'callback_error': 'There was an error during the OAuth process. Please try again.',
      };
      
      setError(errorMessages[errorParam] || 'An authentication error occurred. Please try again.');
    }
  }, [searchParams]);

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signIn.social({
        provider: 'github',
        callbackURL: '/dashboard',
        fetchOptions: {
          onSuccess: () => {
            router.push('/dashboard');
          },
          onError: (ctx) => {
            console.error('Auth error:', ctx.error);
            setError('Failed to sign up with GitHub. Please try again.');
            setIsLoading(false);
          }
        }
      });
    } catch (error) {
      console.error('Sign up error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold text-foreground mb-2 hover:text-primary transition-all duration-200 font-display bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent hover:scale-105"
          >
            ClickChutney
          </button>
          <p className="text-sm text-muted-foreground">
            Create your account
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-xl shadow-xl">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}
          
          {/* GitHub Sign Up Button */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 border border-primary/20 text-primary-foreground rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 font-display"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </button>

          {/* Features List */}
          <div className="mt-6 pt-6 border-t border-border/30">
            <h3 className="text-sm font-semibold text-foreground mb-3 font-display">
              What you&apos;ll get:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-chart-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Real-time analytics dashboard
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-chart-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited project tracking
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-chart-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced user insights
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border opacity-30" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground text-xs">or</span>
            </div>
          </div>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-chart-1 rounded-full animate-spin" />
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}