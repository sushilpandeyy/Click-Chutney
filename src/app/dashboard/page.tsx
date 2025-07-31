"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { authActions } from "@/lib/auth-client"
import {
  BarChart3,
  Clock,
  Eye,
  Flame,
  Home,
  LogOut,
  Plus,
  Settings,
  Users,
  Zap,
  TrendingUp,
  Coffee,
  Cookie,
  CheckCircle2,
  Globe,
  ArrowRight,
  Crown,
  Shield,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ThemeToggle } from "@/components/theme-toggle"

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
  userRole: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  userJoinedAt: string
  _count: {
    events: number
    members: number
  }
}

const chartData = [
  { name: "Mon", visits: 120 },
  { name: "Tue", visits: 190 },
  { name: "Wed", visits: 300 },
  { name: "Thu", visits: 250 },
  { name: "Fri", visits: 420 },
  { name: "Sat", visits: 380 },
  { name: "Sun", visits: 290 },
]

const statCards = [
  {
    title: "Visits",
    value: "2,847",
    subtitle: "Today",
    icon: Eye,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    title: "Top Page",
    value: "/pricing",
    subtitle: "Most visited",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Avg Time",
    value: "3m 24s",
    subtitle: "Session length",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Peak Hour",
    value: "2-3 PM",
    subtitle: "Busiest time",
    icon: Flame,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
]

function AppSidebar({ currentPage = "dashboard" }: { currentPage?: string }) {
  const router = useRouter()
  
  const menuItems = [
    { title: "Dashboard", icon: Home, href: "/dashboard", key: "dashboard" },
    { title: "Projects", icon: BarChart3, href: "/dashboard/projects", key: "projects" },
    { title: "Team", icon: Users, href: "#", key: "team" },
    { title: "Settings", icon: Settings, href: "/dashboard/settings", key: "settings" },
  ]

  const handleLogout = async () => {
    const result = await authActions.signOut()
    if (result.success) {
      router.push("/login")
    }
  }

  const handleMenuClick = (href: string) => {
    if (href !== "#") {
      router.push(href)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg">
            🥭
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">ClickChutney</h1>
            <p className="text-xs opacity-80 text-sidebar-foreground">Analytics</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-4">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start gap-3 rounded-xl transition-all ${
                    currentPage === item.key
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <button onClick={() => handleMenuClick(item.href)}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasProjects = projects.length > 0

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentPage="dashboard" />

        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🍯</div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                      Analytics Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">Track your site performance</p>
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <a href="/dashboard/new-project">
                <Plus className="w-5 h-5 mr-2" />
                Add Project
              </a>
            </Button>
          </div>

          {loading ? (
            /* Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="rounded-xl shadow-sm animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-muted rounded-lg"></div>
                      <div className="w-12 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-3 bg-muted rounded"></div>
                      <div className="w-20 h-6 bg-muted rounded"></div>
                      <div className="w-24 h-3 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : hasProjects ? (
            <>
              {/* Projects Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Total
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Projects</p>
                      <p className="text-xl font-bold text-foreground">{projects.length}</p>
                      <p className="text-xs text-muted-foreground">Active tracking</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Status
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Verified</p>
                      <p className="text-xl font-bold text-foreground">
                        {projects.filter(p => p.isVerified).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Ready to track</p>
                    </div>
                  </CardContent>
                </Card>

                {statCards.slice(2).map((stat, index) => (
                  <Card key={index + 2} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Live
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Projects */}
              <Card className="rounded-xl shadow-sm mb-8">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Recent Projects
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/projects'}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => {
                      const getRoleIcon = (role: string) => {
                        switch (role) {
                          case 'OWNER': return <Crown className="w-3 h-3 text-yellow-600" />
                          case 'ADMIN': return <Shield className="w-3 h-3 text-blue-600" />
                          case 'MEMBER': return <User className="w-3 h-3 text-green-600" />
                          default: return <Eye className="w-3 h-3 text-gray-500" />
                        }
                      }

                      const getRoleBadgeColor = (role: string) => {
                        switch (role) {
                          case 'OWNER': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          case 'ADMIN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          case 'MEMBER': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }
                      }

                      return (
                        <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/project/${project.id}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Globe className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{project.name}</p>
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(project.userRole)}`}>
                                  {getRoleIcon(project.userRole)}
                                  {project.userRole}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">{project.domain}</p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">{project._count.events} events</p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">{project._count.members} member{project._count.members !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={project.isVerified ? "default" : "secondary"}>
                              {project.isVerified ? "Verified" : "Pending"}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                    Traffic Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                        <XAxis dataKey="name" stroke="currentColor" className="opacity-60" fontSize={12} />
                        <YAxis stroke="currentColor" className="opacity-60" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            color: "hsl(var(--popover-foreground))",
                          }}
                          formatter={(value) => [`${value} visits`, "Traffic"]}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="visits"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: "#DC2626" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Empty State */
            <Card className="rounded-xl shadow-sm text-center py-12">
              <CardContent>
                <div className="max-w-sm mx-auto">
                  <div className="text-5xl mb-4">🍽️</div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    No projects yet
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Add your first project to start tracking analytics
                  </p>
                  <Button
                    size="default"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-6 py-2 font-semibold"
                    asChild
                  >
                    <a href="/dashboard/new-project">
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <footer className="mt-8 py-4 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                Made with ❤️ and extra chutney
                <span className="text-base">🍯</span>
              </p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-accent">
                  <Coffee className="w-4 h-4 text-amber-600" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-accent">
                  <Cookie className="w-4 h-4 text-orange-600" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-accent">
                  <Flame className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
