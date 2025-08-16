import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user info
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true
      }
    });

    // If user doesn't exist in Prisma but session exists, create the user
    if (!user && session?.user) {
      console.log('🔄 Creating user in Prisma database from session');
      try {
        user = await prisma.user.create({
          data: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name || null,
            image: session.user.image || null,
            emailVerified: session.user.emailVerified || false,
            // Add any GitHub-specific fields if available
            githubId: (session.user as any).githubId || null,
            githubLogin: (session.user as any).githubLogin || null,
          },
          include: {
            accounts: true
          }
        });
        console.log('✅ User created successfully in Prisma');
      } catch (error) {
        console.error('❌ Error creating user in Prisma:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get projects
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        stats: true
      }
    });

    // Calculate statistics from project stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const pendingProjects = projects.filter(p => p.status === 'PENDING_SETUP').length;

    const totalEvents = projects.reduce((sum, project) => 
      sum + (project.stats?.totalEvents || 0), 0
    );
    
    const totalPageViews = projects.reduce((sum, project) => 
      sum + (project.stats?.pageViews || 0), 0
    );
    
    const totalSessions = projects.reduce((sum, project) => 
      sum + (project.stats?.sessions || 0), 0
    );

    // Get recent activity
    const recentActivity = await prisma.analyticsEvent.findMany({
      where: {
        project: {
          userId
        }
      },
      include: {
        project: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });

    // Calculate time-based events
    const now = new Date();
    
    // This month's events
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEvents = await prisma.analyticsEvent.count({
      where: {
        project: { userId },
        timestamp: { gte: thisMonth }
      }
    });

    // This week's events  
    const thisWeek = new Date(now);
    thisWeek.setDate(now.getDate() - 7);
    const thisWeekEvents = await prisma.analyticsEvent.count({
      where: {
        project: { userId },
        timestamp: { gte: thisWeek }
      }
    });

    // Today's events
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEvents = await prisma.analyticsEvent.count({
      where: {
        project: { userId },
        timestamp: { gte: today }
      }
    });

    // Prepare quick projects data
    const quickProjects = projects.slice(0, 6).map(project => ({
      id: project.id,
      name: project.name,
      status: project.status,
      trackingId: project.trackingId,
      website: project.website,
      createdAt: project.createdAt.toISOString(),
      stats: project.stats ? {
        totalEvents: project.stats.totalEvents,
        pageViews: project.stats.pageViews,
        uniqueVisitors: project.stats.uniqueVisitors,
        bounceRate: project.stats.bounceRate,
        avgSessionDuration: project.stats.avgSessionDuration
      } : null
    }));

    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        githubLogin: user.accounts.find(a => a.providerId === 'github')?.providerAccountId || null,
        memberSince: user.createdAt.toISOString()
      },
      statistics: {
        totalProjects,
        activeProjects,
        pendingProjects,
        totalEvents,
        totalPageViews,
        totalSessions,
        thisMonthEvents,
        thisWeekEvents,
        todayEvents
      },
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        event: activity.event,
        url: activity.url,
        timestamp: activity.timestamp.toISOString(),
        projectName: activity.project.name,
        projectId: activity.projectId
      })),
      quickProjects
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}