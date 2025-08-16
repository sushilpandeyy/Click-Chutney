import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    const projectId = searchParams.get('projectId');

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '12m':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get user projects
    const projects = await prisma.project.findMany({
      where: { 
        userId,
        ...(projectId && projectId !== 'all' && { id: projectId })
      },
      include: {
        stats: true
      }
    });

    if (projects.length === 0) {
      return Response.json({
        user: {
          id: userId,
          name: session.user.name,
          email: session.user.email
        },
        projects: [],
        globalStats: {
          totalEvents: 0,
          totalPageViews: 0,
          totalSessions: 0,
          totalUniqueVisitors: 0,
          avgBounceRate: 0,
          avgSessionDuration: 0,
          conversionRate: 0,
          topPages: [],
          topSources: [],
          deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
          browserBreakdown: [],
          timeSeriesData: [],
          realTimeData: {
            activeUsers: 0,
            currentPageViews: 0,
            eventsLastHour: 0,
            topActivePages: []
          }
        }
      });
    }

    const projectIds = projects.map(p => p.id);

    // Get analytics events for the time range
    const events = await prisma.analyticsEvent.findMany({
      where: {
        projectId: { in: projectIds },
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Calculate global statistics
    const totalEvents = events.length;
    const totalPageViews = events.filter(e => e.event === 'pageview').length;
    
    // Calculate unique visitors (unique sessionIds or approximate from IP)
    const sessionsWithId = events.filter(e => e.sessionId);
    const uniqueSessions = sessionsWithId.length > 0 
      ? new Set(sessionsWithId.map(e => e.sessionId)).size
      : Math.floor(totalEvents * 0.3); // Fallback approximation
    
    const totalSessions = uniqueSessions;
    
    // For unique visitors, we'll use a simple approximation
    const totalUniqueVisitors = Math.floor(uniqueSessions * 0.8); // Approximate unique visitors

    // Calculate bounce rate (sessions with only one event)
    const sessionEventCounts = sessionsWithId.reduce((acc, event) => {
      if (event.sessionId) {
        acc[event.sessionId] = (acc[event.sessionId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const bouncedSessions = Object.values(sessionEventCounts).filter(count => count === 1).length;
    const avgBounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

    // Calculate average session duration (mock data for now)
    const avgSessionDuration = 145; // 2m 25s average

    // Calculate conversion rate (mock data for now)
    const conversionRate = 2.5;

    // Calculate top pages
    const pageViews = events.filter(e => e.event === 'pageview');
    const pageViewCounts = pageViews.reduce((acc, event) => {
      const url = event.url || '/';
      acc[url] = (acc[url] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([url, views]) => ({
        url,
        views,
        percentage: totalPageViews > 0 ? (views / totalPageViews) * 100 : 0
      }));

    // Calculate top sources (mock data for now)
    const topSources = [
      { source: 'Direct', visitors: Math.floor(totalUniqueVisitors * 0.4), percentage: 40 },
      { source: 'Google', visitors: Math.floor(totalUniqueVisitors * 0.3), percentage: 30 },
      { source: 'Social Media', visitors: Math.floor(totalUniqueVisitors * 0.2), percentage: 20 },
      { source: 'Referrals', visitors: Math.floor(totalUniqueVisitors * 0.1), percentage: 10 }
    ];

    // Device breakdown (mock data)
    const deviceBreakdown = {
      desktop: 60,
      mobile: 35,
      tablet: 5
    };

    // Browser breakdown (mock data)
    const browserBreakdown = [
      { browser: 'Chrome', percentage: 65, users: Math.floor(totalUniqueVisitors * 0.65) },
      { browser: 'Safari', percentage: 20, users: Math.floor(totalUniqueVisitors * 0.20) },
      { browser: 'Firefox', percentage: 10, users: Math.floor(totalUniqueVisitors * 0.10) },
      { browser: 'Edge', percentage: 5, users: Math.floor(totalUniqueVisitors * 0.05) }
    ];

    // Time series data (last 7 days)
    const timeSeriesData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayEvents = events.filter(e => 
        e.timestamp >= dayStart && e.timestamp < dayEnd
      );
      
      const dayPageViews = dayEvents.filter(e => e.event === 'pageview').length;
      const daySessionsWithId = dayEvents.filter(e => e.sessionId);
      const daySessions = daySessionsWithId.length > 0 
        ? new Set(daySessionsWithId.map(e => e.sessionId)).size
        : Math.floor(dayEvents.length * 0.3);
      const dayUniqueVisitors = Math.floor(daySessions * 0.8);

      timeSeriesData.push({
        date: dayStart.toISOString().split('T')[0],
        events: dayEvents.length,
        pageViews: dayPageViews,
        sessions: daySessions,
        uniqueVisitors: dayUniqueVisitors
      });
    }

    // Real-time data
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);
    
    const recentEvents = events.filter(e => e.timestamp >= lastHour);
    const activeUsers = Math.floor(Math.random() * 10) + 1; // Mock active users
    const currentPageViews = recentEvents.filter(e => e.event === 'pageview').length;
    const eventsLastHour = recentEvents.length;

    const topActivePages = topPages.slice(0, 5).map(page => ({
      url: page.url,
      activeUsers: Math.floor(Math.random() * 5) + 1
    }));

    const response = {
      user: {
        id: userId,
        name: session.user.name,
        email: session.user.email
      },
      projects: projects.map(project => ({
        id: project.id,
        name: project.name,
        trackingId: project.trackingId,
        status: project.status,
        stats: project.stats ? {
          totalEvents: project.stats.totalEvents,
          pageViews: project.stats.pageViews,
          uniqueVisitors: project.stats.uniqueVisitors,
          bounceRate: project.stats.bounceRate,
          avgSessionDuration: project.stats.avgSessionDuration,
          sessions: project.stats.sessions
        } : null
      })),
      globalStats: {
        totalEvents,
        totalPageViews,
        totalSessions,
        totalUniqueVisitors,
        avgBounceRate,
        avgSessionDuration,
        conversionRate,
        topPages,
        topSources,
        deviceBreakdown,
        browserBreakdown,
        timeSeriesData,
        realTimeData: {
          activeUsers,
          currentPageViews,
          eventsLastHour,
          topActivePages
        }
      }
    };

    return Response.json(response);
  } catch (error) {
    console.error('Analytics overview error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}