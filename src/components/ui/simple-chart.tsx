import * as React from "react"
import { cn } from "@/lib/utils"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface SimpleBarChartProps {
  data: DataPoint[]
  className?: string
  height?: number
}

export function SimpleBarChart({ data, className, height = 200 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className={cn("flex items-end justify-between gap-2 px-4 py-2", className)} style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2 flex-1">
          <div className="text-xs text-muted-foreground font-medium">
            {item.value}
          </div>
          <div 
            className="w-full bg-gradient-to-t from-primary to-chart-1 rounded-t-md min-h-[4px] transition-all duration-500 hover:opacity-80" 
            style={{ 
              height: maxValue > 0 ? `${(item.value / maxValue) * (height - 60)}px` : '4px',
              backgroundColor: item.color || 'var(--color-primary)'
            }}
          />
          <div className="text-xs text-muted-foreground text-center">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

interface SimpleLineChartProps {
  data: DataPoint[]
  className?: string
  height?: number
}

export function SimpleLineChart({ data, className, height = 200 }: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = maxValue > 0 ? 100 - ((item.value / maxValue) * 100) : 50
    return `${x},${y}`
  }).join(' ')

  return (
    <div className={cn("relative", className)} style={{ height }}>
      <svg 
        width="100%" 
        height={height - 40} 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="absolute top-0 left-0"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          points={points}
          className="transition-all duration-500"
        />
        <polygon
          fill="url(#gradient)"
          points={`0,100 ${points} 100,100`}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-muted-foreground text-center">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

interface MetricDisplayProps {
  label: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: React.ReactNode
}

export function MetricDisplay({ label, value, change, changeType = "neutral", icon }: MetricDisplayProps) {
  const changeColors = {
    positive: "text-chart-4",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
      {icon && (
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {change && (
          <p className={cn("text-sm font-medium", changeColors[changeType])}>
            {change}
          </p>
        )}
      </div>
    </div>
  )
}