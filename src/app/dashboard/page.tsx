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
    title: "Visits Today",
    value: "2,847",
    subtitle: "Sweet like mango! 🥭",
    icon: Eye,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Top Page",
    value: "/pricing",
    subtitle: "Crispy like pappad! 🍘",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Avg Time",
    value: "3m 24s",
    subtitle: "Perfect chai time! ☕",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "Spiciest Hour",
    value: "2-3 PM",
    subtitle: "It's sizzling! 🌶️",
    icon: Flame,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
]

function AppSidebar() {
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="bg-gradient-to-b from-yellow-400 to-yellow-500 text-yellow-900">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            🥭
          </div>
          <div>
            <h1 className="font-bold text-lg">ClickChutney</h1>
            <p className="text-xs opacity-80">Spicy Analytics</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-yellow-400 to-yellow-500">
        <div className="p-4">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start gap-3 rounded-xl transition-all ${
                    item.active ? "bg-white text-yellow-900 shadow-md" : "text-yellow-900 hover:bg-yellow-300/50"
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

      <SidebarFooter className="bg-gradient-to-b from-yellow-500 to-yellow-600 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-yellow-900 hover:bg-yellow-300/50 rounded-xl"
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-yellow-50">
        <AppSidebar />

        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <SidebarTrigger className="md:hidden" />
              <div className="flex items-center gap-3">
                <div className="text-4xl">🍯</div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Welcome to ClickChutney—Your Spiciest Analytics!
                  </h1>
                  <p className="text-lg text-gray-600">Your dashboard is freshly served. Let's spice up your growth!</p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-6 h-6 mr-2" />
              Add Your First Project
              <span className="ml-2">🌶️</span>
            </Button>
          </div>

          {hasProjects ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <Card key={index} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <Badge variant="secondary" className="bg-cream text-gray-700">
                          Live
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="rounded-2xl shadow-md border-0 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                    Recent Traffic (Demo Data)
                    <span className="text-sm">📈</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FEF7ED",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value) => [`${value} visits`, "Traffic"]}
                          labelFormatter={(label) => `${label}: Spice level rising! 🌶️`}
                        />
                        <Line
                          type="monotone"
                          dataKey="visits"
                          stroke="#F59E0B"
                          strokeWidth={3}
                          dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: "#DC2626" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Empty State */
            <Card className="rounded-2xl shadow-md border-0 text-center py-16">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-6">🍽️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No stats yet… time to cook up some analytics!
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Your dashboard is ready to serve up some delicious insights. Add your first project to get started
                    with the spiciest analytics in town!
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-8 py-4 font-semibold"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Get Cooking!
                    <span className="ml-2">👨‍🍳</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <footer className="mt-12 py-6 border-t border-orange-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 flex items-center gap-2">
                Made with ❤️ and extra chutney
                <span className="text-lg">🍯</span>
              </p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-orange-100">
                  <Coffee className="w-5 h-5 text-amber-600" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-orange-100">
                  <Cookie className="w-5 h-5 text-orange-600" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-orange-100">
                  <Flame className="w-5 h-5 text-red-600" />
                </Button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
