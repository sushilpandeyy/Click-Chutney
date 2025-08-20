'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
          setStats(statsData);
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
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
          <span className="text-gray-400">Loading project...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
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
              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Events</p>
                    <p className="text-2xl font-bold text-white">{stats?.totalEvents?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Page Views</p>
                    <p className="text-2xl font-bold text-white">{stats?.pageviews?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-600/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Sessions</p>
                    <p className="text-2xl font-bold text-white">{stats?.uniqueSessions?.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Bounce Rate</p>
                    <p className="text-2xl font-bold text-white">{stats?.bounceRate || 0}%</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-600/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Details */}
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Analytics Overview</h3>
              <p className="text-gray-400 mb-4">
                Detailed analytics and insights will be available here. This includes charts, graphs, 
                and detailed breakdowns of user behavior, traffic sources, and conversion metrics.
              </p>
              <div className="bg-[#0a0a0a] border border-[#262626] rounded-md p-4">
                <p className="text-sm text-gray-400">
                  📊 Coming soon: Interactive charts, funnel analysis, cohort analysis, and custom event tracking.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'tracking':
        return (
          <div className="space-y-6">
            {/* Tracking Setup */}
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Next.js Analytics Component</h3>
              <div className="space-y-6">
                {/* Tracking ID */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">Your Tracking ID:</p>
                  <div className="flex items-center gap-3">
                    <code className="bg-[#0a0a0a] border border-[#262626] rounded px-3 py-2 text-sm text-white flex-1">
                      {project.trackingId}
                    </code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(project.trackingId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                

                {/* Analytics Component */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">1. Create Analytics Component (components/Analytics.tsx):</p>
                  <div className="bg-[#0a0a0a] border border-[#262626] rounded p-4 overflow-x-auto">
                    <code className="text-sm text-gray-300 whitespace-pre-wrap">
{`'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AnalyticsConfig {
  trackingId: string;
  endpoint: string;
  debug?: boolean;
}

const AnalyticsContext = createContext<any>(null);

export function Analytics({ children, config }: { 
  children: ReactNode; 
  config: AnalyticsConfig;
}) {
  const [visitorId, setVisitorId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      let vid = localStorage.getItem('analytics_visitor');
      if (!vid) {
        vid = 'visitor_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        localStorage.setItem('analytics_visitor', vid);
      }
      setVisitorId(vid);
      
      // Generate session ID (new for each page load)
      const sid = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      setSessionId(sid);
      
      setIsInitialized(true);
    }
  }, []);

  const track = async (eventName: string, properties: any = {}) => {
    // Ensure we're running on the client side and initialized
    if (typeof window === 'undefined') {
      console.warn('⚠️ Analytics: track() called on server side, skipping');
      return;
    }
    
    if (!isInitialized || !visitorId || !sessionId) {
      console.warn('⚠️ Analytics: Not initialized yet, skipping event:', eventName);
      return;
    }

    const payload = {
      event: eventName,
      properties,
      trackingId: config.trackingId,
      visitorId,
      sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    if (config.debug) {
      console.log('📊 Sending Analytics Event:', {
        event: payload.event,
        properties: payload.properties,
        trackingId: payload.trackingId,
        visitorId: payload.visitorId,
        url: payload.url,
        endpoint: config.endpoint
      });
    }

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      const result = await response.json();
      
      if (config.debug) {
        console.log('✅ Analytics Event Sent Successfully:', result);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Analytics Error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: config.endpoint,
        event: eventName,
        trackingId: config.trackingId
      });
      
      // Don't throw error - analytics failures shouldn't break the app
      return null;
    }
  };

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}`}
                    </code>
                  </div>
                </div>

                {/* Cloudflare Worker */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">2. Cloudflare Worker Endpoint (Global CDN):</p>
                  <div className="bg-[#0a0a0a] border border-[#262626] rounded p-4 overflow-x-auto">
                    <code className="text-sm text-gray-300 whitespace-pre-wrap">
{`// ✅ Global Cloudflare Worker deployed at:
// https://analyticseventtracker.contact-sushilpandey.workers.dev

// Features:
// - Global CDN with edge locations worldwide
// - Full CORS support for any origin
// - Direct MongoDB logging via Data API
// - Automatic project stats updates
// - Geolocation data from Cloudflare
// - High performance & reliability

// Use this endpoint in your config:
endpoint: "https://analyticseventtracker.contact-sushilpandey.workers.dev"`}
                    </code>
                  </div>
                </div>

                {/* Usage Example */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">3. Use in Your App:</p>
                  <div className="bg-[#0a0a0a] border border-[#262626] rounded p-4 overflow-x-auto">
                    <code className="text-sm text-gray-300 whitespace-pre-wrap">
{`// app/layout.tsx
import { Analytics } from '@/components/Analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Analytics 
          config={{
            trackingId: "${project.trackingId}",
            endpoint: "https://analyticseventtracker.contact-sushilpandey.workers.dev",
            debug: true
          }}
        >
          {children}
        </Analytics>
      </body>
    </html>
  );
}

// Any component
'use client';
import { useAnalytics } from '@/components/Analytics';

export default function MyPage() {
  const { track } = useAnalytics();

  return (
    <div>
      <button onClick={() => track('button_click', { button: 'hero' })}>
        Click Me (Global Cloudflare Worker!)
      </button>
      
      <button onClick={() => track('purchase', { 
        value: 99.99, 
        currency: 'USD' 
      })}>
        Buy Now
      </button>
    </div>
  );
}`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="space-y-6">
            {/* User Analytics */}
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">User Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats?.uniqueSessions || 0}</p>
                  <p className="text-sm text-gray-400">Unique Visitors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{Math.round(stats?.avgSessionDuration || 0)}s</p>
                  <p className="text-sm text-gray-400">Avg. Session Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats?.bounceRate || 0}%</p>
                  <p className="text-sm text-gray-400">Bounce Rate</p>
                </div>
              </div>
            </div>

            {/* User Segments */}
            <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">User Segments</h3>
              <p className="text-gray-400 mb-4">
                Analyze user behavior patterns, demographics, and create custom user segments.
              </p>
              <div className="bg-[#0a0a0a] border border-[#262626] rounded-md p-4">
                <p className="text-sm text-gray-400">
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

  return (
    <div className="space-y-8">
      {/* Header with improved styling */}
      <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    project.status === 'ACTIVE' 
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                      : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                  }`}>
                    {project.status === 'ACTIVE' ? 'Active' : 'Setup Required'}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {project.trackingId}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400">
                {project.description || `Analytics dashboard for ${project.name}`}
              </p>
              {project.website && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a 
                    href={project.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors hover:underline"
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
      <div className="bg-[#111111] border border-[#262626] rounded-lg">
        <div className="px-6 pt-6">
          <nav className="flex space-x-1">
            {projectTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
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