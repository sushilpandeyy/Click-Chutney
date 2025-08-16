'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  projects: Array<{
    id: string;
    name: string;
    trackingId: string;
    status: string;
    stats: {
      totalEvents: number;
      pageViews: number;
      uniqueVisitors: number;
      bounceRate: number;
      avgSessionDuration: number;
      sessions: number;
    } | null;
  }>;
  globalStats: {
    totalEvents: number;
    totalPageViews: number;
    totalSessions: number;
    totalUniqueVisitors: number;
    avgBounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
    topPages: Array<{
      url: string;
      views: number;
      percentage: number;
    }>;
    topSources: Array<{
      source: string;
      visitors: number;
      percentage: number;
    }>;
    deviceBreakdown: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
    browserBreakdown: Array<{
      browser: string;
      percentage: number;
      users: number;
    }>;
    timeSeriesData: Array<{
      date: string;
      events: number;
      pageViews: number;
      sessions: number;
      uniqueVisitors: number;
    }>;
    realTimeData: {
      activeUsers: number;
      currentPageViews: number;
      eventsLastHour: number;
      topActivePages: Array<{
        url: string;
        activeUsers: number;
      }>;
    };
  };
}

interface AnalyticsOverviewProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
}

const TIME_RANGES = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last 12 months', value: '12m' }
];

const METRICS_CARDS = [
  {
    title: 'Total Page Views',
    key: 'totalPageViews',
    icon: '👁️',
    color: 'blue',
    format: 'number'
  },
  {
    title: 'Unique Visitors',
    key: 'totalUniqueVisitors',
    icon: '👥',
    color: 'emerald',
    format: 'number'
  },
  {
    title: 'Total Sessions',
    key: 'totalSessions',
    icon: '🕒',
    color: 'purple',
    format: 'number'
  },
  {
    title: 'Bounce Rate',
    key: 'avgBounceRate',
    icon: '📉',
    color: 'yellow',
    format: 'percentage'
  },
  {
    title: 'Avg. Session Duration',
    key: 'avgSessionDuration',
    icon: '⏱️',
    color: 'pink',
    format: 'duration'
  },
  {
    title: 'Conversion Rate',
    key: 'conversionRate',
    icon: '🎯',
    color: 'green',
    format: 'percentage'
  }
];

export function AnalyticsOverview({ session }: AnalyticsOverviewProps) {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedProject, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        timeRange,
        ...(selectedProject !== 'all' && { projectId: selectedProject })
      });
      
      const response = await fetch(`/api/analytics/overview?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Analytics data fetch error:', err);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'number':
        return value.toLocaleString();
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'duration':
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        return `${minutes}m ${seconds}s`;
      default:
        return value.toString();
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-600/10 text-blue-500',
      emerald: 'bg-emerald-600/10 text-emerald-500',
      purple: 'bg-purple-600/10 text-purple-500',
      yellow: 'bg-yellow-600/10 text-yellow-500',
      pink: 'bg-pink-600/10 text-pink-500',
      green: 'bg-green-600/10 text-green-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'realtime', name: 'Real-time', icon: '🔴' },
    { id: 'pages', name: 'Pages', icon: '📄' },
    { id: 'sources', name: 'Traffic Sources', icon: '🔗' },
    { id: 'audience', name: 'Audience', icon: '👥' },
    { id: 'events', name: 'Events', icon: '⚡' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
          <span className="text-gray-400">Loading analytics...</span>
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
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.projects.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Comprehensive analytics and insights for your projects.</p>
        </div>
        
        <div className="bg-[#111111] border border-[#262626] rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">No Analytics Data</h4>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Create projects and start collecting analytics data to see insights and metrics.
          </p>
          <button 
            onClick={() => router.push('/dashboard/projects')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 text-sm font-medium transition-colors"
          >
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">
              Comprehensive insights and metrics for your projects.
            </p>
          </div>
          
          {/* Controls */}
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
            {/* Project Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Project:</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-[#111111] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">All Projects</option>
                {analyticsData.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Time:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-[#111111] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                {TIME_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-[#262626]">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {METRICS_CARDS.map((metric) => (
              <div key={metric.key} className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatValue(
                        analyticsData.globalStats[metric.key as keyof typeof analyticsData.globalStats] as number || 0,
                        metric.format
                      )}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(metric.color)}`}>
                    <span className="text-xl">{metric.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traffic Chart */}
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📈</span>
                Traffic Overview
              </h3>
              <div className="h-64 flex items-center justify-center border border-[#262626] rounded-lg bg-[#0a0a0a]">
                <p className="text-gray-400 text-sm">Chart visualization will be implemented</p>
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📱</span>
                Device Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Desktop</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-[#262626] rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analyticsData.globalStats.deviceBreakdown.desktop}%` }}
                      />
                    </div>
                    <span className="text-white text-sm w-12 text-right">
                      {analyticsData.globalStats.deviceBreakdown.desktop}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mobile</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-[#262626] rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analyticsData.globalStats.deviceBreakdown.mobile}%` }}
                      />
                    </div>
                    <span className="text-white text-sm w-12 text-right">
                      {analyticsData.globalStats.deviceBreakdown.mobile}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tablet</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-[#262626] rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analyticsData.globalStats.deviceBreakdown.tablet}%` }}
                      />
                    </div>
                    <span className="text-white text-sm w-12 text-right">
                      {analyticsData.globalStats.deviceBreakdown.tablet}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Pages and Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Pages */}
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📄</span>
                Top Pages
              </h3>
              <div className="space-y-3">
                {analyticsData.globalStats.topPages.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{page.url}</p>
                      <p className="text-gray-400 text-xs">{page.views.toLocaleString()} views</p>
                    </div>
                    <div className="ml-4">
                      <span className="text-blue-400 text-sm">{page.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Sources */}
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🔗</span>
                Traffic Sources
              </h3>
              <div className="space-y-3">
                {analyticsData.globalStats.topSources.slice(0, 5).map((source, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{source.source}</p>
                      <p className="text-gray-400 text-xs">{source.visitors.toLocaleString()} visitors</p>
                    </div>
                    <div className="ml-4">
                      <span className="text-emerald-400 text-sm">{source.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Tab */}
      {activeTab === 'realtime' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-white">Active Users</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {analyticsData.globalStats.realTimeData.activeUsers}
              </p>
            </div>
            
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Page Views (Live)</h3>
              <p className="text-3xl font-bold text-white">
                {analyticsData.globalStats.realTimeData.currentPageViews}
              </p>
            </div>
            
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Events (Last Hour)</h3>
              <p className="text-3xl font-bold text-white">
                {analyticsData.globalStats.realTimeData.eventsLastHour}
              </p>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Pages</h3>
            <div className="space-y-3">
              {analyticsData.globalStats.realTimeData.topActivePages.map((page, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-gray-300 truncate">{page.url}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white">{page.activeUsers}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {activeTab !== 'overview' && activeTab !== 'realtime' && (
        <div className="bg-[#111111] border border-[#262626] rounded-lg p-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">{tabs.find(t => t.id === activeTab)?.name}</h3>
          <p className="text-gray-400">This section is under development.</p>
        </div>
      )}
    </div>
  );
}