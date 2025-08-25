import { NextRequest, NextResponse } from 'next/server';
import { RealTimeTracker } from '@/lib/redis';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingId, page, visitorId } = body;
    
    if (!trackingId || !page || !visitorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get visitor info from headers
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    
    // Simple country detection (in production, use a proper geolocation service)
    const getCountryFromIP = () => {
      // This is a placeholder - in production, use a geolocation service
      const countries = ['🇺🇸', '🇬🇧', '🇨🇦', '🇩🇪', '🇫🇷', '🇯🇵', '🇦🇺', '🇧🇷'];
      return countries[Math.floor(Math.random() * countries.length)];
    };
    
    // Track the visitor
    await RealTimeTracker.trackVisitor(trackingId, visitorId, {
      page,
      ...(userAgent && { userAgent }),
      ...(referrer && { referrer }),
      ...(getCountryFromIP() && { country: getCountryFromIP() }),
      timestamp: Date.now(),
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}