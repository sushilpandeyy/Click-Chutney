"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Users, 
  Globe, 
  TrendingUp, 
  Settings, 
  Eye,
  Calendar,
  MapPin,
  Clock
} from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project/ProjectSidebar"

interface Project {
  id: string
  name: string
  domain: string
  url: string
  description?: string
  trackingId: string
  isActive: boolean
  isVerified: boolean
  verifiedAt?: string
  createdAt: string
  updatedAt: string
  members: ProjectMember[]
  _count: {
    events: number
    members: number
  }
}

interface ProjectMember {
  id: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

interface Analytics {
  totalViews: number
  uniqueVisitors: number
  topPages: Array<{ url: string; views: number }>
  recentEvents: Array<{
    id: string
    type: string
    data: any
    country?: string
    city?: string
    createdAt: string
  }>
}

export default function ProjectDashboard() {
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      
      // Fetch project details
      const projectRes = await fetch(`/api/projects/${projectId}`)
      if (!projectRes.ok) {
        throw new Error('Failed to fetch project')
      }
      const projectData = await projectRes.json()
      setProject(projectData)

      // Fetch analytics
      const analyticsRes = await fetch(`/api/projects/${projectId}/analytics`)
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || "The project you're looking for doesn't exist or you don't have access to it."}
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userRole = project.members.find(m => m.user.id === 'current-user-id')?.role || 'VIEWER'
  const canManage = ['OWNER', 'ADMIN'].includes(userRole)

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <ProjectSidebar 
          currentPage="overview"
          projectName={project.name}
          projectDomain={project.domain}
        />
        
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-background">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="ml-4">
                <h1 className="font-semibold">Project Overview</h1>
                <p className="text-sm text-muted-foreground">Analytics dashboard for {project.name}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-6">
            {/* Project Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge variant={project.isVerified ? "default" : "secondary"}>
                {project.isVerified ? "Verified" : "Unverified"}
              </Badge>
              <Badge variant={project.isActive ? "outline" : "destructive"}>
                {project.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {project.domain}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {project._count.members} member{project._count.members !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
          
          {canManage && (
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Project Settings
            </Button>
          )}
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalViews?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">All time page views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.uniqueVisitors?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">Unique users tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project._count?.events?.toLocaleString() || '0'}</div>
              <p className="text-xs text-muted-foreground">Total events captured</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Live</div>
              <p className="text-xs text-muted-foreground">Analytics active</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            {canManage && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics?.topPages?.length ? analytics.topPages.map((page, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm truncate flex-1 mr-2">{page.url}</span>
                        <span className="text-sm font-medium">{page.views}</span>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground">No page data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.recentEvents?.length ? analytics.recentEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{event.type}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.country && event.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.city}, {event.country}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {event.createdAt ? new Date(event.createdAt).toLocaleTimeString() : 'Unknown'}
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground">No recent events</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Event timeline and detailed analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members ({project._count.members})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {member.user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{member.user.name}</div>
                          <div className="text-xs text-muted-foreground">{member.user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{member.role}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Joined {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {canManage && (
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Project configuration and team management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}