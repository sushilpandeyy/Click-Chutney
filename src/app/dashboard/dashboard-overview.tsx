'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectCreateModal } from '@/components/project-create-modal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { StatCard } from '@/components/ui/stat-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  status: string;
  trackingId: string;
  website: string | null;
  createdAt: string;
  stats: {
    totalEvents: number;
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
  } | null;
}

interface DashboardOverviewProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
    };
  };
}

export function DashboardOverview({ }: DashboardOverviewProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/dashboard/overview', {
          credentials: 'include',
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data.quickProjects || []);
      } catch (err) {
        console.error('Projects fetch error:', err);
        setError('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    // Refetch data after project creation
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <LoadingSpinner size="md" />
          <span className="text-muted-foreground">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Overview", isActive: true }
        ]}
        className="mb-6"
      />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-display">
              Projects Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your analytics projects
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {projects.length === 0 ? "Create First Project" : "New Project"}
            </Button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-200 group hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate font-display">
                    {project.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 truncate font-mono">
                    ID: {project.trackingId}
                  </p>
                  {project.website && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {project.website}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 font-medium ${
                  project.status === 'ACTIVE' 
                    ? 'bg-chart-4/20 text-chart-4 border border-chart-4/30' 
                    : 'bg-chart-3/20 text-chart-3 border border-chart-3/30'
                }`}>
                  {project.status === 'ACTIVE' ? 'Active' : 'Setup'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-card-foreground">
                    {project.stats?.totalEvents || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-card-foreground">
                    {project.stats?.pageViews || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
              
              <button 
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm py-2 px-3 transition-all duration-200 hover:scale-105 font-semibold"
              >
                View Dashboard
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          title="No Projects Yet"
          description="Create your first project to start tracking analytics and user behavior across your websites and applications."
          action={{
            label: "Create First Project",
            onClick: () => setShowCreateModal(true)
          }}
          className="bg-card border border-border rounded-xl"
        />
      )}

      {/* Project Creation Modal */}
      <ProjectCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}