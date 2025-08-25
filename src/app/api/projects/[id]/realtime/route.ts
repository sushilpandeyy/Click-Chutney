import { NextRequest, NextResponse } from 'next/server';
import { RealTimeTracker } from '@/lib/redis';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get real-time stats using the tracking ID
    const stats = await RealTimeTracker.getProjectStats(project.trackingId);
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        timestamp: Date.now(),
      },
    });

  } catch (error) {
    console.error('Error fetching real-time data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}