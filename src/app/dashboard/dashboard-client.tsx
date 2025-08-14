'use client';

import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DashboardClientProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
}

export function DashboardClient({ session }: DashboardClientProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
          },
        },
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#262626] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-xl font-semibold hover:text-gray-300 transition-colors"
              >
                ClickChutney
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Welcome, {session.user.name || session.user.email}
              </span>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {isSigningOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-400">
            Welcome to your analytics dashboard. Your projects will appear here.
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Projects</span>
                <span className="text-white font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Events</span>
                <span className="text-white font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-medium">0</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No recent activity</p>
            </div>
          </div>

          {/* Get Started */}
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Get Started</h3>
            <p className="text-gray-400 text-sm mb-4">
              Create your first project to start tracking analytics.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
              Create Project
            </button>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6 opacity-75">
              <h4 className="font-medium mb-2">Project Management</h4>
              <p className="text-gray-400 text-sm">
                Create and manage multiple analytics projects with ease.
              </p>
            </div>
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6 opacity-75">
              <h4 className="font-medium mb-2">Real-time Analytics</h4>
              <p className="text-gray-400 text-sm">
                Monitor user behavior and site performance in real-time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}