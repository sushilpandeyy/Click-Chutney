"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Download,
  Check,
  Zap,
  BarChart3,
  Users,
  Database
} from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"

export default function BillingPage() {
  const { data: session } = useSession()
  const [currentPlan, setCurrentPlan] = useState("Free")
  const [usage, setUsage] = useState({
    events: 15420,
    projects: 3,
    teamMembers: 1
  })

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Up to 10K events/month",
        "3 projects",
        "1 team member",
        "Basic analytics",
        "30 days data retention"
      ],
      limits: {
        events: 10000,
        projects: 3,
        teamMembers: 1
      },
      current: currentPlan === "Free"
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      features: [
        "Up to 100K events/month",
        "Unlimited projects",
        "5 team members",
        "Advanced analytics",
        "1 year data retention",
        "Custom domains",
        "Email support"
      ],
      limits: {
        events: 100000,
        projects: -1,
        teamMembers: 5
      },
      current: currentPlan === "Pro",
      popular: true
    },
    {
      name: "Business",
      price: "$99",
      period: "per month",
      features: [
        "Up to 1M events/month",
        "Unlimited projects",
        "Unlimited team members",
        "Real-time analytics",
        "Unlimited data retention",
        "Custom domains",
        "Priority support",
        "API access",
        "Custom integrations"
      ],
      limits: {
        events: 1000000,
        projects: -1,
        teamMembers: -1
      },
      current: currentPlan === "Business"
    }
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentPage="billing" />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div>
                  <h1 className="text-3xl font-bold">Billing & Usage</h1>
                  <p className="text-muted-foreground">Manage your subscription and view usage</p>
                </div>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>

        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{currentPlan}</div>
                <Badge variant="outline">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentPlan === "Free" ? "Free forever" : "Renews monthly"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events This Month</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usage.events.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {currentPlan === "Free" ? `${(usage.events / 10000 * 100).toFixed(1)}% of 10K limit` : "Unlimited"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentPlan === "Free" ? "Never" : "Feb 1"}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentPlan === "Free" ? "Free plan" : "Auto-renewal"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Details */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span>Events</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{usage.events.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {currentPlan === "Free" ? "of 10,000" : "Unlimited"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span>Projects</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{usage.projects}</div>
                  <div className="text-xs text-muted-foreground">
                    {currentPlan === "Free" ? "of 3" : "Unlimited"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Team Members</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{usage.teamMembers}</div>
                  <div className="text-xs text-muted-foreground">
                    {currentPlan === "Free" ? "of 1" : currentPlan === "Pro" ? "of 5" : "Unlimited"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
            <p className="text-muted-foreground">Upgrade or downgrade your plan anytime</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.current && <Badge variant="outline">Current</Badge>}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No billing history available</p>
              <p className="text-sm">You're currently on the Free plan</p>
            </div>
          </CardContent>
        </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}