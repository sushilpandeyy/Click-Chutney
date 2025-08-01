"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Layout,
  Plus,
  Settings,
  Move,
  Maximize2,
  Minimize2,
  X,
  BarChart3,
  Users,
  Globe,
  Activity,
  Clock,
  TrendingUp,
  Eye,
  MousePointer,
  PieChart,
  Map,
  Calendar
} from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/project/ProjectSidebar"
import { MetricWidget } from "@/components/widgets/MetricWidget"
import { ChartWidget } from "@/components/widgets/ChartWidget"
import { TableWidget } from "@/components/widgets/TableWidget"

interface Widget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'map'
  title: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  data?: any
  config?: any
}

export default function ProjectViewPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchProject()
    initializeDefaultWidgets()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaultWidgets = () => {
    const defaultWidgets: Widget[] = [
      {
        id: '1',
        type: 'metric',
        title: 'Total Visitors',
        size: 'small',
        position: { x: 0, y: 0 },
        data: { value: '12,847', change: '+12%', period: 'vs last month', icon: Users }
      },
      {
        id: '2',
        type: 'metric',
        title: 'Page Views',
        size: 'small',
        position: { x: 1, y: 0 },
        data: { value: '34,521', change: '+8%', period: 'vs last month', icon: Eye }
      },
      {
        id: '3',
        type: 'metric',
        title: 'Bounce Rate',
        size: 'small',
        position: { x: 2, y: 0 },
        data: { value: '34.5%', change: '-5%', period: 'vs last month', icon: Activity }
      },
      {
        id: '4',
        type: 'metric',
        title: 'Avg Session',
        size: 'small',
        position: { x: 3, y: 0 },
        data: { value: '3m 24s', change: '+15%', period: 'vs last month', icon: Clock }
      },
      {
        id: '5',
        type: 'chart',
        title: 'Visitors Over Time',
        size: 'large',
        position: { x: 0, y: 1 },
        data: { chartType: 'line' }
      },
      {
        id: '6',
        type: 'chart',
        title: 'Top Pages',
        size: 'medium',
        position: { x: 2, y: 1 },
        data: { chartType: 'bar' }
      },
      {
        id: '7',
        type: 'chart',
        title: 'Device Types',
        size: 'small',
        position: { x: 0, y: 2 },
        data: { chartType: 'pie' }
      },
      {
        id: '8',
        type: 'table',
        title: 'Real-time Events',
        size: 'medium',
        position: { x: 1, y: 2 },
        data: {
          tableData: [
            { event: 'pageview', page: '/', time: '2s ago' },
            { event: 'click', page: '/pricing', time: '5s ago' },
            { event: 'scroll', page: '/features', time: '8s ago' },
            { event: 'form_submit', page: '/contact', time: '12s ago' }
          ],
          columns: [
            { key: 'event', label: 'Event', type: 'badge' },
            { key: 'page', label: 'Page' },
            { key: 'time', label: 'Time', type: 'time' }
          ]
        }
      }
    ]
    setWidgets(defaultWidgets)
  }

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      size: 'medium',
      position: { x: 0, y: Math.max(...widgets.map(w => w.position.y)) + 1 },
      data: {}
    }
    setWidgets(prev => [...prev, newWidget])
  }

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id))
  }

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }

  const getWidgetIcon = (type: Widget['type']) => {
    switch (type) {
      case 'metric': return <BarChart3 className="w-4 h-4" />
      case 'chart': return <TrendingUp className="w-4 h-4" />
      case 'table': return <Activity className="w-4 h-4" />
      case 'map': return <Map className="w-4 h-4" />
    }
  }

  const getGridClass = (size: Widget['size']) => {
    switch (size) {
      case 'small': return 'col-span-1'
      case 'medium': return 'col-span-2'
      case 'large': return 'col-span-4'
    }
  }

  const renderWidget = (widget: Widget) => {
    const isMetric = widget.type === 'metric'
    const isChart = widget.type === 'chart'
    const isTable = widget.type === 'table'

    if (isMetric && widget.data) {
      return (
        <MetricWidget
          key={widget.id}
          id={widget.id}
          title={widget.title}
          value={widget.data.value}
          change={widget.data.change}
          period={widget.data.period}
          icon={widget.data.icon}
          size={widget.size}
          editMode={editMode}
          onRemove={removeWidget}
          onEdit={(id) => console.log('Edit widget:', id)}
        />
      )
    }

    if (isChart && widget.data) {
      return (
        <ChartWidget
          key={widget.id}
          id={widget.id}
          title={widget.title}
          chartType={widget.data.chartType}
          data={widget.data}
          size={widget.size}
          editMode={editMode}
          onRemove={removeWidget}
          onEdit={(id) => console.log('Edit widget:', id)}
        />
      )
    }

    if (isTable && widget.data) {
      return (
        <TableWidget
          key={widget.id}
          id={widget.id}
          title={widget.title}
          data={widget.data.tableData}
          columns={widget.data.columns}
          size={widget.size}
          editMode={editMode}
          onRemove={removeWidget}
          onEdit={(id) => console.log('Edit widget:', id)}
        />
      )
    }

    return null
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
          currentPage="view"
          projectName={project.name}
          projectDomain={project.domain}
        />
        
        <main className="flex-1 flex flex-col">
          <div className="border-b bg-background">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="ml-4 flex items-center gap-3">
                <Layout className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="font-semibold">Custom View</h1>
                  <p className="text-sm text-muted-foreground">Customize your analytics dashboard with widgets</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant={editMode ? "default" : "outline"}
                  onClick={() => setEditMode(!editMode)}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {editMode ? 'Done' : 'Edit Layout'}
                </Button>
                {editMode && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => addWidget('metric')} className="gap-1">
                      <Plus className="w-3 h-3" />
                      Metric
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addWidget('chart')} className="gap-1">
                      <Plus className="w-3 h-3" />
                      Chart
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addWidget('table')} className="gap-1">
                      <Plus className="w-3 h-3" />
                      Table
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            {editMode && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">Edit Mode Active</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can now add, remove, and configure widgets. Click and drag to reorder, or use the controls to resize and configure each widget.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {widgets.map(renderWidget)}
              
              {editMode && (
                <Card className="col-span-1 bg-card/20 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                    <div className="text-center text-muted-foreground group-hover:text-primary transition-colors">
                      <Plus className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Add Widget</p>
                      <p className="text-xs">Click to add a new widget</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Widget Templates */}
            {editMode && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Widget Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { type: 'metric', title: 'Conversion Rate', icon: TrendingUp },
                    { type: 'chart', title: 'Traffic Sources', icon: PieChart },
                    { type: 'table', title: 'Top Referrers', icon: Activity },
                    { type: 'map', title: 'Visitor Map', icon: Map }
                  ].map((template, index) => (
                    <Card key={index} className="bg-card/30 hover:bg-card/50 cursor-pointer transition-colors" onClick={() => addWidget(template.type as Widget['type'])}>
                      <CardContent className="p-4 text-center">
                        <template.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">{template.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{template.type} widget</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}