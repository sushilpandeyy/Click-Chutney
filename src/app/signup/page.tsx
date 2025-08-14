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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-semibold text-white mb-2 hover:text-gray-300 transition-colors"
          >
            ClickChutney
          </button>
          <p className="text-sm text-gray-400">
            Create your account
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {/* GitHub Sign Up Button */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-4 py-3 text-sm font-medium hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
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
          <div className="mt-6 pt-6 border-t border-[#262626]">
            <h3 className="text-sm font-medium text-white mb-3">
              What you&apos;ll get:
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Real-time analytics dashboard
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited project tracking
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced user insights
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#262626]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#111111] px-2 text-gray-400">or</span>
            </div>
          </div>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-white hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
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
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}