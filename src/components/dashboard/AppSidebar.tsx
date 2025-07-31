"use client"

import { useRouter } from "next/navigation"
import { authActions } from "@/lib/auth-client"
import {
  Home,
  BarChart3,
  CreditCard,
  Settings,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  currentPage?: string
}

export function AppSidebar({ currentPage = "dashboard" }: AppSidebarProps) {
  const router = useRouter()
  
  const menuItems = [
    { title: "Dashboard", icon: Home, href: "/dashboard", key: "dashboard" },
    { title: "Projects", icon: BarChart3, href: "/dashboard/projects", key: "projects" },
    { title: "Billing", icon: CreditCard, href: "/dashboard/billing", key: "billing" },
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