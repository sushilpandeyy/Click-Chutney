'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectCreateModal } from '@/components/project-create-modal';

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
    thisWeekEvents: number;
    todayEvents: number;
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
    website: string | null;
    createdAt: string;
    stats: {
      totalEvents: number;
      pageViews: number;
      uniqueVisitors: number;
      bounceRate: number;
      avgSessionDuration: number;
    } | null;
  }>;
}

interface DashboardOverviewProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
    };
  };
}

export function DashboardOverview({ session }: DashboardOverviewProps) {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/overview', {
        credentials: 'include',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
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
  }, [router]);

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    // Refetch data after project creation
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
          <span className="text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-400">
              Welcome back, {user?.name || session.user.name || 'User'}! Here&apos;s what&apos;s happening with your analytics.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Projects</p>
              <p className="text-2xl font-bold text-white">{stats?.totalProjects || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-green-500 text-sm">{stats?.activeProjects || 0} active</span>
            <span className="text-gray-500">•</span>
            <span className="text-yellow-500 text-sm">{stats?.pendingProjects || 0} setup</span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Today&apos;s Events</p>
              <p className="text-2xl font-bold text-white">{(stats?.todayEvents || 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-600/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-emerald-500 text-sm">Live tracking active</span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Page Views</p>
              <p className="text-2xl font-bold text-white">{(stats?.totalPageViews || 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-600/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-500 text-sm">All time total</span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Sessions</p>
              <p className="text-2xl font-bold text-white">{(stats?.totalSessions || 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-purple-500 text-sm">User sessions</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Recent Activity
              </h3>
            </div>
            
            {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-[#262626] last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{activity.event}</p>
                        <p className="text-gray-400 text-xs">{activity.projectName}</p>
                        {activity.url && (
                          <p className="text-gray-500 text-xs truncate max-w-[200px]">{activity.url}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400 text-sm">No recent activity</p>
                <p className="text-gray-500 text-xs mt-1">Events will appear here once you start tracking</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-3 text-sm font-medium transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {stats?.totalProjects === 0 ? "Create First Project" : "New Project"}
              </button>
              
            </div>
          </div>

          {/* System Status */}
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Analytics API</span>
                <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Real-time Tracking</span>
                <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Data Processing</span>
                <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Database</span>
                <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Your Projects ({dashboardData?.statistics?.totalProjects || 0})
          </h3>
          {dashboardData?.quickProjects && dashboardData.quickProjects.length > 0 && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </button>
          )}
        </div>
        
        {dashboardData?.quickProjects && dashboardData.quickProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.quickProjects.map((project) => (
              <div key={project.id} className="bg-[#111111] border border-[#262626] rounded-lg p-6 hover:border-[#404040] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">{project.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">ID: {project.trackingId}</p>
                    {project.website && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{project.website}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
                    project.status === 'ACTIVE' 
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                      : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                  }`}>
                    {project.status === 'ACTIVE' ? 'Active' : 'Setup'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{project.stats?.totalEvents || 0}</p>
                    <p className="text-xs text-gray-400">Events</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{project.stats?.pageViews || 0}</p>
                    <p className="text-xs text-gray-400">Views</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded text-xs py-2 px-3 transition-colors"
                >
                  View Dashboard
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">No Projects Yet</h4>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first project to start tracking analytics and user behavior across your websites and applications.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 text-sm font-medium transition-colors flex items-center gap-2 justify-center mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create First Project
            </button>
          </div>
        )}
      </div>

      {/* Project Creation Modal */}
      <ProjectCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}