"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectStatus } from "@/components/project/ProjectStatus"
import { 
  Plus,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  domain: string
  url: string
  trackingId: string
  isVerified: boolean
  verifiedAt?: string
  createdAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationUpdate = () => {
    fetchProjects()
    if (selectedProject) {
      // Update the selected project
      const updatedProject = { ...selectedProject, isVerified: true, verifiedAt: new Date().toISOString() }
      setSelectedProject(updatedProject)
    }
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
            <h1 className="text-3xl font-bold">Project Details</h1>
          </div>
          
          <ProjectStatus 
            project={selectedProject} 
            onVerificationUpdate={handleVerificationUpdate}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">Projects</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Projects</h1>
          </div>
          
          <Link href="/dashboard/new-project">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-sm mx-auto">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-3">No projects yet</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Create your first project to start tracking analytics
                </p>
                <Link href="/dashboard/new-project">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="w-5 h-5" />
                      {project.name}
                    </CardTitle>
                    <Badge variant={project.isVerified ? "default" : "secondary"}>
                      {project.isVerified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Domain</p>
                    <p className="font-medium">{project.domain}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">URL</p>
                    <p className="font-medium text-blue-600 hover:underline">
                      {project.url}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Tracking ID</p>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {project.trackingId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>

                  {!project.isVerified && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Verification required
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {projects.filter(p => p.isVerified).length} of {projects.length} projects verified
            </p>
          </div>
        )}
      </div>
    </div>
  )
}