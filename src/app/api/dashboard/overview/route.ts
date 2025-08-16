import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true
      }
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
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

    // Calculate this month's events
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthEvents = await prisma.analyticsEvent.count({
      where: {
        project: {
          userId
        },
        timestamp: {
          gte: thisMonth
        }
      }
    });

    // Prepare quick projects data
    const quickProjects = projects.slice(0, 6).map(project => ({
      id: project.id,
      name: project.name,
      status: project.status,
      trackingId: project.trackingId,
      stats: project.stats ? {
        totalEvents: project.stats.totalEvents,
        pageViews: project.stats.pageViews,
        uniqueVisitors: project.stats.uniqueVisitors
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
        thisMonthEvents
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

    return Response.json(response);
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}