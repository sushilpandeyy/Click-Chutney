import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function getUserFromRequest(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    return session?.user;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        userId: user.id 
      },
      include: {
        stats: true
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let stats = project.stats;
    
    if (!stats) {
      stats = await prisma.projectStats.create({
        data: {
          trackingId: project.trackingId,
          totalEvents: 0,
          uniqueVisitors: 0,
          uniqueSessions: 0,
          pageviews: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          todayEvents: 0,
          thisWeekEvents: 0,
          thisMonthEvents: 0
        }
      });
    }

    // Calculate additional time-based stats
    const now = new Date();
    
    // Today's events
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEvents = await prisma.analyticsEvent.count({
      where: {
        projectId: project.id,
        timestamp: { gte: today }
      }
    });

    // This week's events  
    const thisWeek = new Date(now);
    thisWeek.setDate(now.getDate() - 7);
    const thisWeekEvents = await prisma.analyticsEvent.count({
      where: {
        projectId: project.id,
        timestamp: { gte: thisWeek }
      }
    });

    // This month's events
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEvents = await prisma.analyticsEvent.count({
      where: {
        projectId: project.id,
        timestamp: { gte: thisMonth }
      }
    });

    const response = {
      stats: {
        totalEvents: stats.totalEvents,
        uniqueSessions: stats.uniqueSessions,
        pageviews: stats.pageviews,
        bounceRate: stats.bounceRate,
        avgSessionDuration: stats.avgSessionDuration,
        todayEvents,
        thisWeekEvents,
        thisMonthEvents
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return NextResponse.json({ error: 'Failed to fetch project stats' }, { status: 500 });
  }
}