"use client"

import { useState } from "react"
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

const chartData = [
  { name: "Mon", visits: 120 },
  { name: "Tue", visits: 190 },
  { name: "Wed", visits: 300 },
  { name: "Thu", visits: 250 },
  { name: "Fri", visits: 420 },
  { name: "Sat", visits: 380 },
  { name: "Sun", visits: 290 },
]

const menuItems = [
  { title: "Dashboard", icon: Home, active: true },
  { title: "Projects", icon: BarChart3, active: false },
  { title: "Team", icon: Users, active: false },
  { title: "Settings", icon: Settings, active: false },
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

function AppSidebar() {
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
                    item.active 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <button>
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
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function Dashboard() {
  const [hasProjects] = useState(false)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

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
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Project
            </Button>
          </div>

          {hasProjects ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                  <Card key={index} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Get Started
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
