'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrackingInstructions } from '@/components/tracking-instructions';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface Project {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  trackingId: string;
  status: string;
  createdAt: string;
}

interface ProjectStats {
  totalEvents: number;
  uniqueSessions: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  todayEvents: number;
  thisWeekEvents: number;
  thisMonthEvents: number;
}

interface AnalyticsData {
  summary: ProjectStats;
  timeSeries: Array<{
    timestamp: string;
    pageviews: number;
    events: number;
  }>;
  topPages: Array<{
    url: string;
    views: number;
  }>;
  topEvents: Array<{
    event: string;
    count: number;
  }>;
  deviceStats: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  referrerStats: Array<{
    source: string;
    count: number;
  }>;
}

interface ProjectDashboardProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
    };
  };
  projectId: string;
}

const projectTabs = [
  {
    name: 'Analytics',
    id: 'analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Tracking',
    id: 'tracking',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    name: 'Users',
    id: 'users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
];

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/dashboard/projects');
            return;
          }
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        setProject(data.project);
        
        // Fetch project stats
        const statsResponse = await fetch(`/api/projects/${projectId}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }

        // Fetch detailed analytics data
        const analyticsResponse = await fetch(`/api/projects/${projectId}/analytics?timeRange=7d`);
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setAnalytics(analyticsData.analytics);
        }
      } catch (err) {
        console.error('Project fetch error:', err);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, router]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-muted-foreground border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading project...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Total Events</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats?.totalEvents?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-chart-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Page Views</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats?.pageviews?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-chart-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Sessions</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats?.uniqueSessions?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-chart-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Bounce Rate</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats?.bounceRate || 0}%</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-chart-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Chart */}
            {analytics?.timeSeries && analytics.timeSeries.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart
                  data={analytics.timeSeries}
                  metric="pageviews"
                  type="line"
                  height={240}
                />
                <AnalyticsChart
                  data={analytics.timeSeries}
                  metric="events"
                  type="bar"
                  height={240}
                />
              </div>
            )}

            {/* Top Pages and Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Top Pages</h3>
                {analytics?.topPages && analytics.topPages.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topPages.slice(0, 5).map((page, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {page.url || '/'}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{page.views}</span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-chart-1 h-2 rounded-full transition-all"
                              style={{ 
                                width: `${analytics.topPages.length > 0 && analytics.topPages[0] ? (page.views / analytics.topPages[0].views) * 100 : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No page data available</p>
                )}
              </div>

              {/* Top Events */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Top Events</h3>
                {analytics?.topEvents && analytics.topEvents.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topEvents.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground capitalize">
                            {event.event}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{event.count}</span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-chart-2 h-2 rounded-full transition-all"
                              style={{ 
                                width: `${analytics.topEvents.length > 0 && analytics.topEvents[0] ? (event.count / analytics.topEvents[0].count) * 100 : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No event data available</p>
                )}
              </div>
            </div>

            {/* Device and Referrer Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Stats */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Device Types</h3>
                {analytics?.deviceStats && analytics.deviceStats.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.deviceStats.map((device, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground">
                            {device.device}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {device.percentage.toFixed(1)}%
                          </span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-chart-3 h-2 rounded-full transition-all"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No device data available</p>
                )}
              </div>

              {/* Referrer Stats */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Traffic Sources</h3>
                {analytics?.referrerStats && analytics.referrerStats.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.referrerStats.slice(0, 5).map((referrer, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {referrer.source}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{referrer.count}</span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-chart-4 h-2 rounded-full transition-all"
                              style={{ 
                                width: `${analytics.referrerStats.length > 0 && analytics.referrerStats[0] ? (referrer.count / analytics.referrerStats[0].count) * 100 : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No referrer data available</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'tracking':
        return (
          <div className="space-y-6">
            <TrackingInstructions 
              trackingId={project.trackingId} 
              domain="clickchutney.vercel.app"
            />
          </div>
        );
      
      case 'users':
        return (
          <div className="space-y-6">
            {/* User Analytics */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">User Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-card-foreground">{stats?.uniqueSessions || 0}</p>
                  <p className="text-sm text-muted-foreground">Unique Visitors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-card-foreground">{Math.round(stats?.avgSessionDuration || 0)}s</p>
                  <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-card-foreground">{stats?.bounceRate || 0}%</p>
                  <p className="text-sm text-muted-foreground">Bounce Rate</p>
                </div>
              </div>
            </div>

            {/* User Segments */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">User Segments</h3>
              <p className="text-muted-foreground mb-4">
                Analyze user behavior patterns, demographics, and create custom user segments.
              </p>
              <div className="bg-muted border border-border rounded-md p-4">
                <p className="text-sm text-muted-foreground">
                  👥 Coming soon: User segmentation, cohort analysis, and behavioral patterns.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/dashboard/projects' },
    { label: project?.name || 'Project', isActive: true }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} className="animate-fade-in" />

      {/* Header with improved styling */}
      <div className="bg-card border border-border rounded-lg p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => router.push('/dashboard/projects')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors focus-ring"
                title="Back to Projects"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    project.status === 'ACTIVE' 
                      ? 'bg-chart-4/20 text-chart-4 border border-chart-4/30' 
                      : 'bg-chart-5/20 text-chart-5 border border-chart-5/30'
                  }`}>
                    {project.status === 'ACTIVE' ? 'Active' : 'Setup Required'}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {project.trackingId}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">
                {project.description || `Analytics dashboard for ${project.name}`}
              </p>
              {project.website && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a 
                    href={project.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 text-sm transition-colors hover:underline focus-ring"
                  >
                    {project.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Navigation Tabs with improved styling */}
      <div className="bg-card border border-border rounded-lg animate-slide-up">
        <div className="px-6 pt-6">
          <nav className="flex space-x-1 overflow-x-auto">
            {projectTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap focus-ring ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6 pt-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}