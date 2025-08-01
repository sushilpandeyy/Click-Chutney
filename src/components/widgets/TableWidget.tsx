"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, X, Activity, Eye, MousePointer, Globe } from "lucide-react"

interface TableRow {
  [key: string]: any
}

interface TableWidgetProps {
  id: string
  title: string
  data: TableRow[]
  columns: { key: string; label: string; type?: 'text' | 'badge' | 'time' }[]
  size?: 'small' | 'medium' | 'large'
  editMode?: boolean
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
}

export function TableWidget({ 
  id, 
  title, 
  data, 
  columns,
  size = 'medium',
  editMode = false,
  onRemove,
  onEdit 
}: TableWidgetProps) {
  const getGridClass = () => {
    switch (size) {
      case 'small': return 'col-span-1'
      case 'medium': return 'col-span-2'
      case 'large': return 'col-span-4'
    }
  }

  const getEventIcon = (event: string) => {
    switch (event.toLowerCase()) {
      case 'pageview': return <Eye className="w-3 h-3 text-blue-500" />
      case 'click': return <MousePointer className="w-3 h-3 text-green-500" />
      case 'scroll': return <Activity className="w-3 h-3 text-orange-500" />
      case 'form_submit': return <Globe className="w-3 h-3 text-purple-500" />
      default: return <Activity className="w-3 h-3 text-muted-foreground" />
    }
  }

  const renderCellContent = (value: any, type?: string) => {
    switch (type) {
      case 'badge':
        return <Badge variant="outline" className="text-xs">{value}</Badge>
      case 'time':
        return <span className="text-muted-foreground">{value}</span>
      default:
        return value
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
          <Activity className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className={`grid grid-cols-${columns.length} gap-2 text-xs font-medium text-muted-foreground`}>
            {columns.map((column) => (
              <span key={column.key}>{column.label}</span>
            ))}
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.map((row, index) => (
              <div key={index} className={`grid grid-cols-${columns.length} gap-2 text-xs py-1`}>
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center gap-1">
                    {column.key === 'event' && getEventIcon(row[column.key])}
                    <span className={column.type === 'time' ? 'text-muted-foreground' : ''}>
                      {renderCellContent(row[column.key], column.type)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            {data.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}