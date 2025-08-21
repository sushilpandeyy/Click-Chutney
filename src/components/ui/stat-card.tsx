import * as React from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: React.ReactNode
  description?: string
  className?: string
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  description,
  className 
}: StatCardProps) {
  const changeColors = {
    positive: "text-chart-4",
    negative: "text-destructive", 
    neutral: "text-muted-foreground"
  }

  return (
    <div className={cn("bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:shadow-md", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        {icon && (
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      {(change || description) && (
        <div className="flex items-center justify-between">
          {change && (
            <span className={cn("text-sm font-medium", changeColors[changeType])}>
              {change}
            </span>
          )}
          {description && (
            <span className="text-muted-foreground text-sm">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}