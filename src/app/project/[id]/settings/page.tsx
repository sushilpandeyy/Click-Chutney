"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings,
  Save,
  AlertTriangle,
  Trash2,
  Globe,
  Shield,
  Eye,
  Bell,
  Palette,
  Database,
  Key,
  RefreshCw
} from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project/ProjectSidebar"

export default function ProjectSettingsPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState({
    name: '',
    domain: '',
    description: '',
    isActive: true,
    trackingEnabled: true,
    cookieConsent: false,
    dataRetention: 365,
    emailNotifications: true,
    slackNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
    realTimeAlerts: false,
    publicDashboard: false,
    allowExports: true,
    ipAnonymization: true,
    respectDNT: true
  })

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        setSettings({
          name: data.name || '',
          domain: data.domain || '',
          description: data.description || '',
          isActive: data.isActive ?? true,
          trackingEnabled: true,
          cookieConsent: false,
          dataRetention: 365,
          emailNotifications: true,
          slackNotifications: false,
          weeklyReports: true,
          monthlyReports: true,
          realTimeAlerts: false,
          publicDashboard: false,
          allowExports: true,
          ipAnonymization: true,
          respectDNT: true
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const generateNewTrackingId = () => {
    const newId = 'cc_' + Math.random().toString(36).substr(2, 12)
    console.log('New tracking ID generated:', newId)
  }

  const handleDeleteProject = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      console.log('Project deletion requested')
    }
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
          currentPage="settings"
          projectName={project.name}
          projectDomain={project.domain}
        />
        
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-background">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="ml-4 flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="font-semibold">Project Settings</h1>
                  <p className="text-sm text-muted-foreground">Manage your project configuration and preferences</p>
                </div>
              </div>
              <div className="ml-auto">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-6 max-w-4xl">
            {/* Basic Settings */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={settings.domain}
                      onChange={(e) => setSettings(prev => ({ ...prev, domain: e.target.value }))}
                      placeholder="example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your project"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <Label>Project Status</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable tracking for this project</p>
                  </div>
                  <Switch
                    checked={settings.isActive}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tracking Configuration */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Tracking Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <Label>Tracking ID</Label>
                    <p className="text-sm text-muted-foreground">Your unique project identifier</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">{project.trackingId}</code>
                  </div>
                  <Button variant="outline" onClick={generateNewTrackingId} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <Label>Enable Tracking</Label>
                      <p className="text-sm text-muted-foreground">Collect analytics data from your website</p>
                    </div>
                    <Switch
                      checked={settings.trackingEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, trackingEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <Label>IP Anonymization</Label>
                      <p className="text-sm text-muted-foreground">Anonymize visitor IP addresses for privacy</p>
                    </div>
                    <Switch
                      checked={settings.ipAnonymization}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, ipAnonymization: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <Label>Respect Do Not Track</Label>
                      <p className="text-sm text-muted-foreground">Honor browser DNT settings</p>
                    </div>
                    <Switch
                      checked={settings.respectDNT}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, respectDNT: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Privacy & Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={settings.dataRetention}
                      onChange={(e) => setSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
                      min="1"
                      max="3650"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Plan</Label>
                    <div className="flex items-center gap-2">
                      <Badge>Free Plan</Badge>
                      <span className="text-sm text-muted-foreground">30 days retention</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <Label>Public Dashboard</Label>
                      <p className="text-sm text-muted-foreground">Allow public access to analytics dashboard</p>
                    </div>
                    <Switch
                      checked={settings.publicDashboard}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, publicDashboard: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <Label>Allow Data Exports</Label>
                      <p className="text-sm text-muted-foreground">Enable CSV/JSON data exports</p>
                    </div>
                    <Switch
                      checked={settings.allowExports}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowExports: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications & Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Get weekly analytics summaries</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <Label>Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">Get detailed monthly analytics reports</p>
                  </div>
                  <Switch
                    checked={settings.monthlyReports}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, monthlyReports: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <Label>Real-time Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of traffic spikes and anomalies</p>
                  </div>
                  <Switch
                    checked={settings.realTimeAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, realTimeAlerts: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-destructive">Delete Project</Label>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this project and all its data. This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteProject} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}