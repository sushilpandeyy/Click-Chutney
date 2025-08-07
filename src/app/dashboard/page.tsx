"use client"

import { useSession } from "@/lib/auth-client"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Dashboard() {
  const { data: session } = useSession()

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
                  <div className="text-4xl">🥭</div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                      Welcome Back!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Let's build your dashboard step by step
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty content area - we'll build this step by step */}
          <div className="flex items-center justify-center min-h-[400px] rounded-lg border-2 border-dashed border-border">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🔨</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Clean Slate Ready
              </h2>
              <p className="text-muted-foreground">
                All dashboard content has been cleared. Ready to build it step by step!
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}