'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectCreateModal } from '@/components/project-create-modal';

interface Project {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  trackingId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalEvents: number;
    pageViews: number;
    uniqueVisitors: number;
  } | null;
  _count: {
    events: number;
  };
}

interface ProjectsClientProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
}

export function ProjectsClient({ session }: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/projects');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Projects fetch error:', err);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = () => {
    // Refresh the projects list after creation
    fetchProjects();
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
      console.error('Delete project error:', err);
      setError('Failed to delete project');
    }
  };

  const copyTrackingId = (trackingId: string) => {
    navigator.clipboard.writeText(trackingId);
    // You could add a toast notification here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
              <span className="text-gray-400">Loading projects...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#262626] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-xl font-semibold hover:text-gray-300 transition-colors"
              >
                ClickChutney
              </button>
              
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Dashboard
                </button>
                <button className="text-white border-b-2 border-blue-500 pb-1 text-sm font-medium">
                  Projects
                </button>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Analytics
                </button>
                <button className="text-gray-400 hover:text-white transition-colors text-sm">
                  Settings
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {session.user.name || session.user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
              <p className="text-gray-400">
                Manage your analytics projects and tracking configurations.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Project
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/30 rounded-md">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-[#111111] border border-[#262626] rounded-lg p-6 hover:border-[#404040] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{project.description}</p>
                    )}
                    {project.website && (
                      <a 
                        href={project.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
                      >
                        {project.website}
                      </a>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'ACTIVE' 
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                      : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                  }`}>
                    {project.status === 'ACTIVE' ? 'Active' : 'Setup'}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{project.stats?.totalEvents || project._count.events || 0}</p>
                    <p className="text-xs text-gray-400">Events</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{project.stats?.pageViews || 0}</p>
                    <p className="text-xs text-gray-400">Page Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{project.stats?.uniqueVisitors || 0}</p>
                    <p className="text-xs text-gray-400">Visitors</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Tracking ID</span>
                    <button 
                      onClick={() => copyTrackingId(project.trackingId)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <code className="text-xs text-gray-300 bg-[#0a0a0a] px-2 py-1 rounded border border-[#262626] block truncate">
                    {project.trackingId}
                  </code>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="flex-1 bg-[#0a0a0a] border border-[#262626] text-white rounded text-xs py-2 px-3 hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors"
                  >
                    View Analytics
                  </button>
                  <button 
                    onClick={() => router.push(`/dashboard/projects/${project.id}/settings`)}
                    className="flex-1 bg-[#0a0a0a] border border-[#262626] text-white rounded text-xs py-2 px-3 hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors"
                  >
                    Settings
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProject(project);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-600/20 border border-red-600/30 text-red-400 rounded text-xs py-2 px-3 hover:bg-red-600/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#262626]">
                  <p className="text-xs text-gray-500">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first project to start tracking analytics and user behavior across your websites and applications.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-6 py-2 text-sm font-medium hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create First Project
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
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