interface GeoLocation {
  country?: string
  city?: string
}

// Simple IP geolocation using a free service
export async function getGeoLocation(ip: string): Promise<GeoLocation> {
  try {
    // Skip private/local IPs
    if (isPrivateIP(ip)) {
      return {}
    }

    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'ClickChutney-Analytics/1.0'
      },
      signal: AbortSignal.timeout(3000) // 3 second timeout
    })

    if (!response.ok) {
      return {}
    }

    const data = await response.json()
    
    return {
      country: data.country_name || undefined,
      city: data.city || undefined
    }
  } catch (error) {
    console.warn('Geolocation lookup failed:', error)
    return {}
  }
}

function isPrivateIP(ip: string): boolean {
  // Check for common private IP ranges
  const privateRanges = [
    /^127\./, // 127.0.0.0/8 (loopback)
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^::1$/, // IPv6 loopback
    /^fc00:/, // IPv6 unique local
    /^fe80:/, // IPv6 link local
  ]

  return privateRanges.some(range => range.test(ip))
}