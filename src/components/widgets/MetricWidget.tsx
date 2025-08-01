"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, X } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface MetricWidgetProps {
  id: string
  title: string
  value: string
  change: string
  period: string
  icon: LucideIcon
  size?: 'small' | 'medium' | 'large'
  editMode?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
}

export function MetricWidget({ 
  id, 
  title, 
  value, 
  change, 
  period, 
  icon: Icon, 
  size = 'small',
  editMode = false,
  onRemove,
  onEdit 
}: MetricWidgetProps) {
  const getGridClass = () => {
    switch (size) {
      case 'small': return 'col-span-1'
      case 'medium': return 'col-span-2'
      case 'large': return 'col-span-4'
    }
  }

  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/50 relative group ${getGridClass()}`}>
      {editMode && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onEdit?.(id)}>
            <Settings className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onRemove?.(id)}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant={change.startsWith('+') ? 'default' : 'secondary'} className="text-xs">
              {change}
            </Badge>
            <span className="text-muted-foreground">{period}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}