"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  Users,
  Globe,
  MousePointer,
  Eye,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project/ProjectSidebar"

interface RealtimeEvent {
  id: string
  type: 'pageview' | 'click' | 'form_submit' | 'scroll'
  page: string
  timestamp: Date
  location: string
  device: 'desktop' | 'mobile' | 'tablet'
  country: string
}

export default function ProjectRealtimePage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([])
  const [activeUsers, setActiveUsers] = useState(47)
  const [currentPageViews, setCurrentPageViews] = useState(12)

  useEffect(() => {
    fetchProject()
    
    // Simulate real-time events
    const interval = setInterval(() => {
      addRandomEvent()
      updateActiveUsers()
    }, 2000)

    return () => clearInterval(interval)
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const addRandomEvent = () => {
    const eventTypes: RealtimeEvent['type'][] = ['pageview', 'click', 'form_submit', 'scroll']
    const pages = ['/', '/pricing', '/features', '/blog', '/contact', '/about']
    const devices: RealtimeEvent['device'][] = ['desktop', 'mobile', 'tablet']
    const countries = ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU', 'IN', 'BR', 'MX']
    const cities = ['New York', 'London', 'Toronto', 'Berlin', 'Paris', 'Tokyo', 'Sydney', 'Mumbai', 'São Paulo', 'Mexico City']

    const newEvent: RealtimeEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      page: pages[Math.floor(Math.random() * pages.length)],
      timestamp: new Date(),
      location: cities[Math.floor(Math.random() * cities.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      country: countries[Math.floor(Math.random() * countries.length)]
    }

    setRealtimeEvents(prev => [newEvent, ...prev.slice(0, 19)]) // Keep last 20 events
  }

  const updateActiveUsers = () => {
    setActiveUsers(prev => {
      const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
      return Math.max(1, prev + change)
    })
    setCurrentPageViews(prev => {
      const change = Math.floor(Math.random() * 3) - 1 // -1 to +1
      return Math.max(0, prev + change)
    })
  }

  const getEventIcon = (type: RealtimeEvent['type']) => {
    switch (type) {
      case 'pageview': return <Eye className="w-4 h-4 text-blue-500" />
      case 'click': return <MousePointer className="w-4 h-4 text-green-500" />
      case 'form_submit': return <Globe className="w-4 h-4 text-purple-500" />
      case 'scroll': return <Activity className="w-4 h-4 text-orange-500" />
    }
  }

  const getDeviceIcon = (device: RealtimeEvent['device']) => {
    switch (device) {
      case 'desktop': return <Monitor className="w-4 h-4 text-muted-foreground" />
      case 'mobile': return <Smartphone className="w-4 h-4 text-muted-foreground" />
      case 'tablet': return <Tablet className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getDeviceStats = () => {
    const deviceCounts = realtimeEvents.reduce((acc, event) => {
      acc[event.device] = (acc[event.device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { device: 'desktop', count: deviceCounts.desktop || 0, icon: Monitor },
      { device: 'mobile', count: deviceCounts.mobile || 0, icon: Smartphone },
      { device: 'tablet', count: deviceCounts.tablet || 0, icon: Tablet }
    ]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <ProjectSidebar 
          currentPage="realtime"
          projectName={project.name}
          projectDomain={project.domain}
        />
        
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-background">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="ml-4 flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="font-semibold">Real-time Analytics</h1>
                  <p className="text-sm text-muted-foreground">Live visitor activity and events</p>
                </div>
              </div>
              <div className="ml-auto">
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Live
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-6">
            {/* Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-3xl font-bold text-primary">{activeUsers}</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Page Views (5m)</p>
                      <p className="text-3xl font-bold text-blue-500">{currentPageViews}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Events (1m)</p>
                      <p className="text-3xl font-bold text-green-500">{realtimeEvents.length}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Session</p>
                      <p className="text-3xl font-bold text-orange-500">3m 24s</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Real-time Events Stream */}
              <div className="lg:col-span-2">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Live Events Stream
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {realtimeEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                          <div className="flex items-center gap-3">
                            {getEventIcon(event.type)}
                            <div>
                              <div className="font-medium text-sm">
                                {event.type.replace('_', ' ').toUpperCase()} - {event.page}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                {event.location}, {event.country}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(event.device)}
                            <span className="text-xs text-muted-foreground">
                              {event.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {realtimeEvents.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No events yet. Events will appear here in real-time.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Device Breakdown */}
              <div>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-primary" />
                      Device Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getDeviceStats().map(({ device, count, icon: Icon }) => (
                        <div key={device} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="capitalize">{device}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{count}</span>
                            <div className="text-xs text-muted-foreground">
                              {realtimeEvents.length > 0 ? Math.round((count / realtimeEvents.length) * 100) : 0}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Top Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from(new Set(realtimeEvents.map(e => `${e.location}, ${e.country}`)))
                        .slice(0, 5)
                        .map((location, index) => (
                          <div key={location} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm">{location}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {realtimeEvents.filter(e => `${e.location}, ${e.country}` === location).length}
                            </span>
                          </div>
                        ))
                      }
                      {realtimeEvents.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No location data yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}