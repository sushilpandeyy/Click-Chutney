'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrackingInstructions } from '@/components/tracking-instructions';
import { AnalyticsChart } from '@/components/ui/analytics-chart';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ProjectAnalyticsSidebar } from '@/components/project-analytics-sidebar';

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


export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('realtime');
  const [isAnalyticsSidebarCollapsed, setIsAnalyticsSidebarCollapsed] = useState(false);
  const [isMobileAnalyticsSidebarOpen, setIsMobileAnalyticsSidebarOpen] = useState(false);

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
      case 'realtime':
        return (
          <div className="space-y-6">
            {/* Real-time Overview */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">Real-time Activity</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chart-4 rounded-full animate-pulse"></div>
                  <span className="text-sm text-chart-4 font-medium">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 50) + 10}</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div className="text-center p-4 bg-chart-1/5 rounded-lg">
                  <p className="text-2xl font-bold text-chart-1">{Math.floor(Math.random() * 100) + 20}</p>
                  <p className="text-sm text-muted-foreground">Pages/min</p>
                </div>
                <div className="text-center p-4 bg-chart-2/5 rounded-lg">
                  <p className="text-2xl font-bold text-chart-2">{Math.floor(Math.random() * 30) + 5}</p>
                  <p className="text-sm text-muted-foreground">Events/min</p>
                </div>
                <div className="text-center p-4 bg-chart-3/5 rounded-lg">
                  <p className="text-2xl font-bold text-chart-3">{Math.floor(Math.random() * 20) + 1}</p>
                  <p className="text-sm text-muted-foreground">Countries</p>
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-md font-semibold text-card-foreground mb-4">Live Page Views</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm animate-fade-in">
                      <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                      <span className="font-mono text-xs text-muted-foreground">{new Date(Date.now() - i * 15000).toLocaleTimeString()}</span>
                      <span className="text-card-foreground">/products/analytics-dashboard</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">🇺🇸</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-md font-semibold text-card-foreground mb-4">Top Active Pages</h4>
                <div className="space-y-3">
                  {[
                    { page: '/', users: 23, percentage: 100 },
                    { page: '/features', users: 18, percentage: 78 },
                    { page: '/pricing', users: 12, percentage: 52 },
                    { page: '/about', users: 8, percentage: 35 },
                    { page: '/contact', users: 4, percentage: 17 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{item.page}</p>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.users}</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-chart-4 h-2 rounded-full transition-all" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Date Range Selector */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-card-foreground">Analytics Overview</h3>
              <select className="px-3 py-2 bg-card border border-border rounded-lg text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Total Sessions</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats?.uniqueSessions?.toLocaleString() || 0}</p>
                    <p className="text-xs text-chart-4 font-medium">+12.5% vs last period</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-chart-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Page Views</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats?.pageviews?.toLocaleString() || 0}</p>
                    <p className="text-xs text-chart-4 font-medium">+8.2% vs last period</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-chart-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Avg. Session Duration</p>
                    <p className="text-2xl font-bold text-card-foreground">{Math.round(stats?.avgSessionDuration || 0)}s</p>
                    <p className="text-xs text-chart-4 font-medium">+5.1% vs last period</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-chart-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Bounce Rate</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats?.bounceRate || 0}%</p>
                    <p className="text-xs text-destructive font-medium">-3.2% vs last period</p>
                  </div>
                  <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-chart-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            {analytics?.timeSeries && analytics.timeSeries.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-card-foreground mb-4">Sessions Over Time</h4>
                  <AnalyticsChart
                    data={analytics.timeSeries}
                    metric="pageviews"
                    type="line"
                    height={240}
                  />
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-card-foreground mb-4">Events Over Time</h4>
                  <AnalyticsChart
                    data={analytics.timeSeries}
                    metric="events"
                    type="bar"
                    height={240}
                  />
                </div>
              </div>
            )}

            {/* Top Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-card-foreground mb-4">Top Pages</h4>
                {analytics?.topPages && analytics.topPages.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topPages.slice(0, 5).map((page, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">{page.url || '/'}</p>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{page.views.toLocaleString()}</span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-chart-1 h-2 rounded-full transition-all"
                              style={{ width: `${analytics.topPages.length > 0 && analytics.topPages[0] ? (page.views / analytics.topPages[0].views) * 100 : 0}%` }}
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

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-card-foreground mb-4">Top Events</h4>
                {analytics?.topEvents && analytics.topEvents.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topEvents.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground capitalize">{event.event}</p>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{event.count.toLocaleString()}</span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-chart-2 h-2 rounded-full transition-all"
                              style={{ width: `${analytics.topEvents.length > 0 && analytics.topEvents[0] ? (event.count / analytics.topEvents[0].count) * 100 : 0}%` }}
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
          </div>
        );

      case 'acquisition':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-card-foreground">Traffic Acquisition</h3>
            
            {/* Acquisition Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Organic Search</p>
                    <p className="text-xs text-muted-foreground">Google, Bing, etc.</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-card-foreground mb-1">65.2%</p>
                <p className="text-xs text-chart-4 font-medium">+8.1% vs last period</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-chart-1/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-chart-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Direct</p>
                    <p className="text-xs text-muted-foreground">Bookmarks, typed URL</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-card-foreground mb-1">18.7%</p>
                <p className="text-xs text-chart-4 font-medium">+2.3% vs last period</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Social Media</p>
                    <p className="text-xs text-muted-foreground">Facebook, Twitter, etc.</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-card-foreground mb-1">16.1%</p>
                <p className="text-xs text-destructive font-medium">-1.2% vs last period</p>
              </div>
            </div>

            {/* Detailed Source Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-card-foreground mb-4">Top Referrers</h4>
                <div className="space-y-3">
                  {[
                    { source: 'google.com', sessions: 1254, percentage: 65.2 },
                    { source: 'direct', sessions: 359, percentage: 18.7 },
                    { source: 'facebook.com', sessions: 187, percentage: 9.7 },
                    { source: 'twitter.com', sessions: 98, percentage: 5.1 },
                    { source: 'linkedin.com', sessions: 25, percentage: 1.3 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{item.source}</p>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.sessions.toLocaleString()}</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-chart-4 h-2 rounded-full transition-all" style={{ width: `${item.percentage}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-10">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-card-foreground mb-4">Search Keywords</h4>
                <div className="space-y-3">
                  {[
                    { keyword: 'analytics dashboard', impressions: 2341, clicks: 189 },
                    { keyword: 'web analytics tool', impressions: 1876, clicks: 145 },
                    { keyword: 'website tracking', impressions: 1432, clicks: 98 },
                    { keyword: 'user behavior analytics', impressions: 987, clicks: 67 },
                    { keyword: 'clickchutney', impressions: 756, clicks: 234 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{item.keyword}</p>
                        <p className="text-xs text-muted-foreground">{item.impressions.toLocaleString()} impressions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-card-foreground">{item.clicks}</p>
                        <p className="text-xs text-muted-foreground">clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'behavior':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-card-foreground">User Behavior</h3>
            
            {/* Behavior Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-card-foreground">{(stats?.pageviews || 0) / (stats?.uniqueSessions || 1) || 2.3}</p>
                <p className="text-sm text-muted-foreground">Pages/Session</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-card-foreground">{Math.round(stats?.avgSessionDuration || 0)}s</p>
                <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-card-foreground">{stats?.bounceRate || 0}%</p>
                <p className="text-sm text-muted-foreground">Bounce Rate</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-card-foreground">78%</p>
                <p className="text-sm text-muted-foreground">New Sessions</p>
              </div>
            </div>

            {/* Page Flow and Exit Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-card-foreground mb-4">Landing Pages</h4>
                <div className="space-y-3">
                  {[
                    { page: '/', sessions: 1234, bounceRate: 45.2 },
                    { page: '/features', sessions: 567, bounceRate: 38.7 },
                    { page: '/pricing', sessions: 234, bounceRate: 52.1 },
                    { page: '/blog/analytics-guide', sessions: 189, bounceRate: 23.4 },
                    { page: '/about', sessions: 123, bounceRate: 67.8 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{item.page}</p>
                        <p className="text-xs text-muted-foreground">{item.sessions} sessions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-card-foreground">{item.bounceRate}%</p>
                        <p className="text-xs text-muted-foreground">bounce rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-card-foreground mb-4">Exit Pages</h4>
                <div className="space-y-3">
                  {[
                    { page: '/checkout', exits: 234, exitRate: 67.2 },
                    { page: '/contact', exits: 187, exitRate: 78.4 },
                    { page: '/pricing', exits: 156, exitRate: 45.8 },
                    { page: '/', exits: 123, exitRate: 12.3 },
                    { page: '/features', exits: 98, exitRate: 23.7 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{item.page}</p>
                        <p className="text-xs text-muted-foreground">{item.exits} exits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-card-foreground">{item.exitRate}%</p>
                        <p className="text-xs text-muted-foreground">exit rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'conversions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-card-foreground">Conversions & Goals</h3>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Create Goal
              </button>
            </div>
            
            {/* Conversion Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Goal Completions</p>
                    <p className="text-xs text-muted-foreground">All goals combined</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-card-foreground mb-1">247</p>
                <p className="text-xs text-chart-4 font-medium">+15.3% vs last period</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-chart-1/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-chart-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Conversion Rate</p>
                    <p className="text-xs text-muted-foreground">Sessions to goals</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-card-foreground mb-1">3.8%</p>
                <p className="text-xs text-chart-4 font-medium">+0.5% vs last period</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Goal Value</p>
                    <p className="text-xs text-muted-foreground">Total revenue attributed</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-card-foreground mb-1">$12,450</p>
                <p className="text-xs text-chart-4 font-medium">+22.1% vs last period</p>
              </div>
            </div>

            {/* Goals List */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-card-foreground mb-4">Active Goals</h4>
              <div className="space-y-4">
                {[
                  { name: 'Newsletter Signup', completions: 89, rate: 4.2, value: 0 },
                  { name: 'Product Purchase', completions: 34, rate: 1.6, value: 8950 },
                  { name: 'Contact Form', completions: 67, rate: 3.1, value: 0 },
                  { name: 'Free Trial Start', completions: 57, rate: 2.7, value: 3500 },
                ].map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">Conversion rate: {goal.rate}%</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-card-foreground">{goal.completions}</p>
                      {goal.value > 0 && (
                        <p className="text-xs text-chart-4 font-medium">${goal.value.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-card-foreground">Team & Access Management</h3>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Invite User
              </button>
            </div>
            
            {/* Current Users */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-card-foreground mb-4">Team Members</h4>
              <div className="space-y-4">
                {[
                  { name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active', lastSeen: '2 hours ago' },
                  { name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Editor', status: 'Active', lastSeen: '1 day ago' },
                  { name: 'Mike Johnson', email: 'mike@company.com', role: 'Viewer', status: 'Invited', lastSeen: 'Never' },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-card-foreground">{user.role}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === 'Active' 
                            ? 'bg-chart-4/20 text-chart-4' 
                            : 'bg-chart-5/20 text-chart-5'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Last seen: {user.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Permissions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-card-foreground mb-4">Permission Levels</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-card-foreground mb-2">Admin</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Full access to all features</li>
                    <li>• Manage team members</li>
                    <li>• Billing and settings</li>
                    <li>• Export data</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-card-foreground mb-2">Editor</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• View all analytics</li>
                    <li>• Create and edit goals</li>
                    <li>• Export reports</li>
                    <li>• Configure tracking</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold text-card-foreground mb-2">Viewer</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• View analytics dashboards</li>
                    <li>• Access reports</li>
                    <li>• No editing permissions</li>
                    <li>• Read-only access</li>
                  </ul>
                </div>
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
    <div className="flex h-screen">
      {/* Project Analytics Sidebar */}
      <ProjectAnalyticsSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsMobileAnalyticsSidebarOpen(false);
        }}
        projectName={project.name}
        isCollapsed={isAnalyticsSidebarCollapsed}
        onToggleCollapse={() => setIsAnalyticsSidebarCollapsed(!isAnalyticsSidebarCollapsed)}
        isMobileOpen={isMobileAnalyticsSidebarOpen}
        onMobileClose={() => setIsMobileAnalyticsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${
        isAnalyticsSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      }`}>
        {/* Mobile Analytics Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-background border-b border-border backdrop-blur-sm">
          <button
            onClick={() => setIsMobileAnalyticsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-accent transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground truncate">{project.name}</h2>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
          </div>
          <div className="w-8" />
        </div>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Breadcrumb Navigation - Hidden on mobile */}
          <div className="hidden lg:block">
            <Breadcrumb items={breadcrumbItems} className="animate-fade-in" />
          </div>

          {/* Header with improved styling */}
          <div className="bg-card border border-border rounded-lg p-4 lg:p-6 animate-fade-in">
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
                  <div className="min-w-0">
                    <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">{project.name}</h1>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        project.status === 'ACTIVE' 
                          ? 'bg-chart-4/20 text-chart-4 border border-chart-4/30' 
                          : 'bg-chart-5/20 text-chart-5 border border-chart-5/30'
                      }`}>
                        {project.status === 'ACTIVE' ? 'Active' : 'Setup Required'}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono truncate">
                        ID: {project.trackingId}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm lg:text-base">
                    {project.description || `Analytics dashboard for ${project.name}`}
                  </p>
                  {project.website && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a 
                        href={project.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 text-sm transition-colors hover:underline focus-ring truncate"
                      >
                        {project.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-slide-up">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}