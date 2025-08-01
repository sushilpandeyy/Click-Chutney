"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, X, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface ChartWidgetProps {
  id: string
  title: string
  chartType: 'line' | 'bar' | 'pie' | 'area'
  data?: any
  size?: 'small' | 'medium' | 'large'
  editMode?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
}

export function ChartWidget({ 
  id, 
  title, 
  chartType, 
  data, 
  size = 'medium',
  editMode = false,
  onRemove,
  onEdit 
}: ChartWidgetProps) {
  const getGridClass = () => {
    switch (size) {
      case 'small': return 'col-span-1'
      case 'medium': return 'col-span-2'
      case 'large': return 'col-span-4'
    }
  }

  const getChartIcon = () => {
    switch (chartType) {
      case 'line': case 'area': return TrendingUp
      case 'bar': return BarChart3
      case 'pie': return PieChart
    }
  }

  const ChartIcon = getChartIcon()

  const getChartHeight = () => {
    switch (size) {
      case 'small': return 'h-24'
      case 'medium': return 'h-32'
      case 'large': return 'h-48'
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
          <ChartIcon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className={`${getChartHeight()} bg-muted/20 rounded-lg flex items-center justify-center`}>
          <div className="text-center text-muted-foreground">
            <ChartIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</p>
            {data && <p className="text-xs mt-1">Live data visualization</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}