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
  const [isSeeding, setIsSeeding] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard/overview');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
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

  const createSampleData = async () => {
    try {
      setIsSeeding(true);
      const response = await fetch('/api/dashboard/seed', {
        method: 'POST'
      });
      
      if (response.ok) {
        // Refresh dashboard data after seeding
        await fetchDashboardData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create sample data');
      }
    } catch (err) {
      console.error('Sample data creation error:', err);
      setError('Failed to create sample data');
    } finally {
      setIsSeeding(false);
    }
  };

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
          <div className="flex gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Retry
            </button>
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={createSampleData}
                disabled={isSeeding}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isSeeding ? 'Creating...' : 'Create Sample Data'}
              </button>
            )}
          </div>
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
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Projects</span>
                <span className="text-white font-medium">{stats?.totalProjects || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Events</span>
                <span className="text-white font-medium">{(stats?.totalEvents || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Page Views</span>
                <span className="text-white font-medium">{(stats?.totalPageViews || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-medium">{(stats?.thisMonthEvents || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Recent Activity
            </h3>
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
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Get Started
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {stats?.totalProjects === 0 
                ? "Create your first project to start tracking analytics."
                : "Manage your projects and view detailed analytics."
              }
            </p>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
                {stats?.totalProjects === 0 ? "Create Project" : "View Projects"}
              </button>
              {process.env.NODE_ENV === 'development' && stats?.totalProjects === 0 && (
                <button
                  onClick={createSampleData}
                  disabled={isSeeding}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                  {isSeeding ? 'Creating Sample Data...' : 'Create Sample Data'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Your Projects
          </h3>
          {dashboardData?.quickProjects && dashboardData.quickProjects.length > 0 ? (
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
          ) : (
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-12 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h4 className="text-lg font-medium text-gray-300 mb-2">No Projects Yet</h4>
              <p className="text-gray-500 mb-6">
                Create your first project to start tracking analytics and user behavior.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  Create First Project
                </button>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={createSampleData}
                    disabled={isSeeding}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {isSeeding ? 'Creating...' : 'Create Sample Data'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}