"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Home,
  BarChart3,
  Users,
  LogOut,
  Save,
  Eye,
  Moon,
  Sun,
} from "lucide-react"
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { useSession } from "@/lib/auth-client"
import { Switch } from "@/components/ui/switch"


export default function SettingsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState(true)
  const [analytics, setAnalytics] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(false)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentPage="settings" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-3">
                  <div className="text-3xl">⚙️</div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your account preferences</p>
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Account Settings */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          defaultValue={session?.user?.name || ""}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={session?.user?.email || ""}
                          placeholder="Enter your email"
                          disabled
                        />
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your analytics
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Weekly analytics reports via email
                        </p>
                      </div>
                      <Switch
                        checked={emailUpdates}
                        onCheckedChange={setEmailUpdates}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics Tracking</p>
                        <p className="text-sm text-muted-foreground">
                          Help improve ClickChutney with usage analytics
                        </p>
                      </div>
                      <Switch
                        checked={analytics}
                        onCheckedChange={setAnalytics}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          Two-Factor Authentication
                        </p>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button size="sm" variant="outline" className="border-blue-300">
                        Enable 2FA
                      </Button>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        This action cannot be undone
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="space-y-6">
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {session?.user?.image ? (
                          <img 
                            src={session.user.image} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{session?.user?.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Member since</span>
                        <span className="text-sm font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Plan</span>
                        <Badge variant="default">Free</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Palette className="w-5 h-5 text-primary" />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred theme
                      </p>
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <span className="text-sm">Toggle theme</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm border-dashed border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">🚀</div>
                    <h3 className="font-medium mb-2 text-orange-800 dark:text-orange-200">
                      Upgrade to Pro
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                      Unlock advanced analytics and unlimited projects
                    </p>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Coming Soon
                    </Button>
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