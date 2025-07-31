"use client"

import { useRouter, useParams } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Database,
  Users,
  Settings,
  ArrowLeft,
  Globe,
  Code,
  LineChart,
  Activity
} from "lucide-react"

interface ProjectSidebarProps {
  currentPage?: string
  projectName?: string
  projectDomain?: string
}

export function ProjectSidebar({ 
  currentPage = "overview", 
  projectName = "Project",
  projectDomain 
}: ProjectSidebarProps) {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const menuItems = [
    { 
      title: "Overview", 
      icon: BarChart3, 
      href: `/project/${projectId}`, 
      key: "overview"
    },
    { 
      title: "Data & Events", 
      icon: Database, 
      href: `/project/${projectId}/data`, 
      key: "data"
    },
    { 
      title: "Real-time", 
      icon: Activity, 
      href: `/project/${projectId}/realtime`, 
      key: "realtime"
    },
    { 
      title: "Team", 
      icon: Users, 
      href: `/project/${projectId}/team`, 
      key: "team"
    },
    { 
      title: "Integration", 
      icon: Code, 
      href: `/project/${projectId}/integration`, 
      key: "integration"
    },
    { 
      title: "Settings", 
      icon: Settings, 
      href: `/project/${projectId}/settings`, 
      key: "settings"
    },
  ]

  const handleMenuClick = (href: string) => {
    router.push(href)
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg">
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-sidebar-foreground truncate">{projectName}</h1>
            <p className="text-xs opacity-80 text-sidebar-foreground truncate">
              {projectDomain || 'Project Analytics'}
            </p>
          </div>
        </div>
        <div className="px-4 pb-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Dashboard</span>
          </Button>
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
        <div className="text-xs text-sidebar-foreground/60 text-center">
          <p>ClickChutney Analytics</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}