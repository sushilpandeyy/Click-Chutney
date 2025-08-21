'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectCreateModal } from '@/components/project-create-modal';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';

interface Project {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  trackingId: string;
  status: 'ACTIVE' | 'SETUP';
  userId: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    id: string;
    totalEvents: number;
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
  } | null;
  _count: {
    events: number;
  };
}

interface ProjectsOverviewProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
    };
  };
}

export function ProjectsOverview({ }: ProjectsOverviewProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'events' | 'status'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'SETUP'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = () => {
    fetchProjects();
    setShowCreateModal(false);
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(prev => prev.filter(p => p.id !== project.id));
      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const handleCopyTrackingId = async (trackingId: string) => {
    try {
      await navigator.clipboard.writeText(trackingId);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy tracking ID:', err);
    }
  };

  const handleGenerateTrackingScript = (trackingId: string) => {
    const script = `<script>
(function(c,h,u,t,n,e,y) {
  c[n] = c[n] || function() { (c[n].q = c[n].q || []).push(arguments) };
  e = h.createElement(u); y = h.getElementsByTagName(u)[0];
  e.async = 1; e.src = t; y.parentNode.insertBefore(e, y);
})(window, document, 'script', '${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/clickchutney-analytics.js', 'chutney');

chutney('init', '${trackingId}');
chutney('track', 'pageview');
</script>`;

    navigator.clipboard.writeText(script);
    // You could add a toast notification here
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.website && project.website.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'events':
          comparison = (a.stats?.totalEvents || 0) - (b.stats?.totalEvents || 0);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <LoadingSpinner size="lg" />
          <span className="text-muted-foreground">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects", isActive: true }
        ]}
        className="mb-6"
      />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-display">Projects</h1>
            <p className="text-muted-foreground">
              Manage your analytics projects and tracking configurations.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="gap-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 bg-[#111111] border border-[#262626] rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects, tracking IDs, or websites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'ACTIVE' | 'SETUP')}
              className="bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="all">All</option>
              <option value="ACTIVE">Active</option>
              <option value="SETUP">Setup</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'created' | 'events' | 'status')}
              className="bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="created">Created Date</option>
              <option value="name">Name</option>
              <option value="events">Events</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          title={projects.length === 0 ? 'No Projects Yet' : 'No Projects Found'}
          description={
            projects.length === 0 
              ? 'Create your first project to start tracking analytics and user behavior.'
              : 'Try adjusting your search terms or filters.'
          }
          {...(projects.length === 0 ? {
            action: {
              label: "Create First Project",
              onClick: () => setShowCreateModal(true)
            }
          } : {})}
          className="bg-card border border-border rounded-xl"
        />
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-[#111111] border border-[#262626] rounded-lg p-6 hover:border-[#404040] transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{project.name}</h3>
                      {project.description && (
                        <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                      )}
                      {project.website && (
                        <a 
                          href={project.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-flex items-center gap-1"
                        >
                          {project.website}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ml-4 flex-shrink-0 ${
                      project.status === 'ACTIVE' 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                        : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                    }`}>
                      {project.status === 'ACTIVE' ? 'Active' : 'Setup Required'}
                    </span>
                  </div>

                  {/* Tracking ID */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">Tracking ID:</span>
                    <code className="text-xs bg-[#0a0a0a] border border-[#262626] px-2 py-1 rounded text-blue-400 font-mono">
                      {project.trackingId}
                    </code>
                    <button
                      onClick={() => handleCopyTrackingId(project.trackingId)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copy tracking ID"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-white">{project.stats?.totalEvents || 0}</p>
                      <p className="text-xs text-gray-400">Total Events</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{project.stats?.pageViews || 0}</p>
                      <p className="text-xs text-gray-400">Page Views</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{project.stats?.uniqueVisitors || 0}</p>
                      <p className="text-xs text-gray-400">Unique Visitors</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{project.stats?.bounceRate ? `${project.stats.bounceRate}%` : '—'}</p>
                      <p className="text-xs text-gray-400">Bounce Rate</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-32">
                  <button 
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded text-sm py-2 px-4 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </button>
                  
                  <button 
                    onClick={() => handleGenerateTrackingScript(project.trackingId)}
                    className="bg-[#0a0a0a] border border-[#262626] text-white rounded text-sm py-2 px-4 hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors flex items-center justify-center gap-2"
                    title="Copy tracking script"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Script
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedProject(project);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-600/20 border border-red-600/30 text-red-400 rounded text-sm py-2 px-4 hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              {/* Project metadata */}
              <div className="mt-4 pt-4 border-t border-[#262626] flex items-center justify-between text-xs text-gray-500">
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>Last updated {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Creation Modal */}
      <ProjectCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Project</h3>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete &quot;{selectedProject.name}&quot;? This action cannot be undone and will permanently delete all analytics data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProject(null);
                  }}
                  className="flex-1 bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(selectedProject)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}