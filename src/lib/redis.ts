import Redis from 'ioredis';

const redis = new Redis(
  process.env.REDIS_URL || 'redis://default:Abo4AAIncDFkZWEwYTRlMGMzMjU0NzE1YjhjNWYwZDRkMjI5MTIwM3AxNDc2NzI@fit-glider-47672.upstash.io:6379',
  {
    tls: {},
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  }
);

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Real-time visitor tracking functions
export class RealTimeTracker {
  static async trackVisitor(projectId: string, visitorId: string, data: {
    page: string;
    userAgent?: string;
    referrer?: string;
    country?: string;
    timestamp?: number;
  }) {
    const timestamp = data.timestamp || Date.now();
    const key = `project:${projectId}:visitors`;
    const visitorKey = `project:${projectId}:visitor:${visitorId}`;
    
    try {
      // Store visitor info with 30-minute expiry
      await redis.hset(visitorKey, {
        page: data.page,
        userAgent: data.userAgent || '',
        referrer: data.referrer || '',
        country: data.country || '',
        lastSeen: timestamp,
      });
      await redis.expire(visitorKey, 1800); // 30 minutes
      
      // Add to active visitors set with score as timestamp
      await redis.zadd(key, timestamp, visitorId);
      
      // Remove visitors older than 30 minutes
      const cutoff = timestamp - (30 * 60 * 1000);
      await redis.zremrangebyscore(key, 0, cutoff);
      
      // Store page view event
      const pageViewKey = `project:${projectId}:pageviews`;
      await redis.lpush(pageViewKey, JSON.stringify({
        visitorId,
        page: data.page,
        timestamp,
        country: data.country,
      }));
      
      // Keep only last 100 page views
      await redis.ltrim(pageViewKey, 0, 99);
      
    } catch (error) {
      console.error('Error tracking visitor:', error);
    }
  }
  
  static async getActiveVisitors(projectId: string) {
    try {
      const cutoff = Date.now() - (30 * 60 * 1000); // 30 minutes ago
      const key = `project:${projectId}:visitors`;
      
      // Remove expired visitors
      await redis.zremrangebyscore(key, 0, cutoff);
      
      // Get active visitor count
      const activeCount = await redis.zcard(key);
      
      // Get visitor details
      const visitorIds = await redis.zrange(key, 0, -1);
      const visitors = [];
      
      for (const visitorId of visitorIds) {
        const visitorData = await redis.hgetall(`project:${projectId}:visitor:${visitorId}`);
        if (visitorData.page) {
          visitors.push({
            id: visitorId,
            page: visitorData.page,
            country: visitorData.country,
            lastSeen: parseInt(visitorData.lastSeen || '0'),
          });
        }
      }
      
      return {
        count: activeCount,
        visitors: visitors.slice(0, 20), // Return top 20 for performance
      };
    } catch (error) {
      console.error('Error getting active visitors:', error);
      return { count: 0, visitors: [] };
    }
  }
  
  static async getRecentPageViews(projectId: string, limit = 10) {
    try {
      const key = `project:${projectId}:pageviews`;
      const pageViews = await redis.lrange(key, 0, limit - 1);
      
      return pageViews.map(view => JSON.parse(view));
    } catch (error) {
      console.error('Error getting page views:', error);
      return [];
    }
  }
  
  static async getProjectStats(projectId: string) {
    try {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      
      const visitors = await this.getActiveVisitors(projectId);
      const recentViews = await this.getRecentPageViews(projectId, 100);
      
      // Calculate pages per minute (last hour)
      const recentPages = recentViews.filter(view => view.timestamp > oneHourAgo);
      const pagesPerMinute = Math.round(recentPages.length / 60);
      
      // Calculate top pages
      const pageCount: Record<string, number> = {};
      recentViews.forEach(view => {
        pageCount[view.page] = (pageCount[view.page] || 0) + 1;
      });
      
      const topPages = Object.entries(pageCount)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Calculate countries
      const countryCount: Record<string, number> = {};
      visitors.visitors.forEach(visitor => {
        if (visitor.country) {
          countryCount[visitor.country] = (countryCount[visitor.country] || 0) + 1;
        }
      });
      
      const topCountries = Object.entries(countryCount)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      return {
        activeVisitors: visitors.count,
        pagesPerMinute,
        eventsPerMinute: Math.round(pagesPerMinute * 0.3), // Estimate
        topPages,
        topCountries,
        recentPageViews: recentViews.slice(0, 10),
      };
    } catch (error) {
      console.error('Error getting project stats:', error);
      return {
        activeVisitors: 0,
        pagesPerMinute: 0,
        eventsPerMinute: 0,
        topPages: [],
        topCountries: [],
        recentPageViews: [],
      };
    }
  }
}

export default redis;