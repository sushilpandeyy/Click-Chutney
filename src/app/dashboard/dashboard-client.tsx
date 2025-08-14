'use client';

import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface DashboardData {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    githubLogin: string | null;
    memberSince: string;
  };
  statistics: {
    totalProjects: number;
    activeProjects: number;
    pendingProjects: number;
    totalEvents: number;
    totalPageViews: number;
    totalSessions: number;
    thisMonthEvents: number;
  };
  recentActivity: Array<{
    id: string;
    event: string;
    url: string | null;
    timestamp: string;
    projectName: string;
    projectId: string;
  }>;
  quickProjects: Array<{
    id: string;
    name: string;
    status: string;
    trackingId: string;
    stats: {
      totalEvents: number;
      pageViews: number;
      uniqueVisitors: number;
    } | null;
  }>;
}

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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard/overview');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
          <span className="text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.statistics;
  const user = dashboardData?.user;

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
                Welcome, {user?.name || session.user.name || session.user.email}
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
            Welcome to your analytics dashboard. Track your projects and analyze user behavior.
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
                <span className="text-white font-medium">{stats?.totalProjects || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Events</span>
                <span className="text-white font-medium">{stats?.totalEvents.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-medium">{stats?.thisMonthEvents.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {dashboardData.recentActivity.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-300">{activity.event}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{activity.projectName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No recent activity</p>
              </div>
            )}
          </div>

          {/* Get Started */}
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Get Started</h3>
            <p className="text-gray-400 text-sm mb-4">
              {stats?.totalProjects === 0 
                ? "Create your first project to start tracking analytics."
                : "Manage your projects and view detailed analytics."
              }
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
              {stats?.totalProjects === 0 ? "Create Project" : "View Projects"}
            </button>
          </div>
        </div>

        {/* Projects Overview */}
        {dashboardData?.quickProjects && dashboardData.quickProjects.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Your Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.quickProjects.map((project) => (
                <div key={project.id} className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'ACTIVE' 
                        ? 'bg-green-900/20 text-green-400' 
                        : 'bg-yellow-900/20 text-yellow-400'
                    }`}>
                      {project.status === 'ACTIVE' ? 'Active' : 'Setup'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Events</span>
                      <span className="text-white">{project.stats?.totalEvents || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Page Views</span>
                      <span className="text-white">{project.stats?.pageViews || 0}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs text-gray-500">ID: {project.trackingId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}