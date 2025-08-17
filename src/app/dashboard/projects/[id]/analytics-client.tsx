'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  summary: {
    totalEvents: number;
    uniqueSessions: number;
    pageviews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  topPages: Array<{ url: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  timeSeries: Array<{ timestamp: string; pageviews: number; events: number }>;
  recentEvents: Array<{
    id: string;
    event: string;
    url: string | null;
    timestamp: string;
    properties: Record<string, unknown>;
  }>;
  deviceStats: Array<{ device: string; count: number; percentage: number }>;
  locationStats: Array<{ location: string; count: number }>;
  referrerStats: Array<{ source: string; count: number }>;
  timeRange: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  trackingId: string;
  status: string;
  createdAt: string;
}

interface AnalyticsClientProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
    };
  };
  projectId: string;
}

export function AnalyticsClient({ session, projectId }: AnalyticsClientProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/dashboard/projects');
            return;
          }
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error('Project fetch error:', err);
        setError('Failed to load project');
      }
    };

    fetchProjectData();
  }, [projectId, router]);

  useEffect(() => {
    if (project) {
      const fetchAnalytics = async () => {
        try {
          setIsLoading(true);
          const params = new URLSearchParams({
            timeRange,
            projectId: project.id
          });
          
          const response = await fetch(`/api/analytics/project?${params}`);
          if (!response.ok) {
            throw new Error('Failed to fetch analytics');
          }
          
          const data = await response.json();
          setAnalytics(data);
        } catch (err) {
          console.error('Analytics fetch error:', err);
          setError('Failed to load analytics');
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnalytics();
    }
  }, [project, timeRange]);


  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#262626] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-xl font-semibold hover:text-gray-300 transition-colors"
              >
                ClickChutney
              </button>
              
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => router.push('/dashboard/projects')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Projects
                </button>
                <button className="text-white border-b-2 border-blue-500 pb-1 text-sm font-medium">
                  Analytics
                </button>
                <button 
                  onClick={() => router.push('/dashboard/settings')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Settings
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {session.user.name || session.user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => router.push('/dashboard/projects')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'ACTIVE' 
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                    : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                }`}>
                  {project.status === 'ACTIVE' ? 'Active' : 'Setup'}
                </span>
              </div>
              <p className="text-gray-400">
                Analytics for {project.description || project.name}
              </p>
              {project.website && (
                <a 
                  href={project.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  {project.website}
                </a>
              )}
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={() => router.push(`/dashboard/projects/${projectId}/settings`)}
                className="bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors duration-200"
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/30 rounded-md">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
              <span className="text-gray-400">Loading analytics...</span>
            </div>
          </div>
        ) : analytics ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <p className="text-gray-400 text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold text-white">{analytics.summary.totalEvents.toLocaleString()}</p>
              </div>
              
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <p className="text-gray-400 text-sm font-medium">Page Views</p>
                <p className="text-2xl font-bold text-white">{analytics.summary.pageviews.toLocaleString()}</p>
              </div>
              
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <p className="text-gray-400 text-sm font-medium">Sessions</p>
                <p className="text-2xl font-bold text-white">{analytics.summary.uniqueSessions.toLocaleString()}</p>
              </div>
              
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <p className="text-gray-400 text-sm font-medium">Bounce Rate</p>
                <p className="text-2xl font-bold text-white">{analytics.summary.bounceRate}%</p>
              </div>
              
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <p className="text-gray-400 text-sm font-medium">Avg. Session</p>
                <p className="text-2xl font-bold text-white">{Math.round(analytics.summary.avgSessionDuration)}s</p>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Pages */}
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
                {analytics.topPages.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topPages.slice(0, 5).map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm truncate flex-1">{page.url || 'Unknown'}</span>
                        <span className="text-white font-medium ml-2">{page.views}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No page data available</p>
                )}
              </div>

              {/* Top Events */}
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Events</h3>
                {analytics.topEvents.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topEvents.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{event.event}</span>
                        <span className="text-white font-medium">{event.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No event data available</p>
                )}
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
              {analytics.recentEvents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#262626]">
                        <th className="text-left text-gray-400 pb-2">Event</th>
                        <th className="text-left text-gray-400 pb-2">URL</th>
                        <th className="text-left text-gray-400 pb-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentEvents.slice(0, 10).map((event) => (
                        <tr key={event.id} className="border-b border-[#262626] last:border-b-0">
                          <td className="py-2 text-white">{event.event}</td>
                          <td className="py-2 text-gray-300 truncate max-w-xs">{event.url || '-'}</td>
                          <td className="py-2 text-gray-400">{new Date(event.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No recent events</p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-12 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">No Analytics Data</h3>
            <p className="text-gray-400 mb-4">
              Start tracking by installing the ClickChutney script on your website.
            </p>
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-md p-4">
              <p className="text-xs text-gray-400 mb-2">Tracking ID:</p>
              <code className="text-sm text-white">{project.trackingId}</code>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}