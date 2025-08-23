'use client';

import { signOut } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
      image?: string | null | undefined;
    };
  };
  projectContext?: {
    projectName: string;
    projectId: string;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
  };
}

const genericNavigation = [
  {
    title: "Main",
    items: [
      {
        name: 'Overview',
        href: '/dashboard',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        badge: null,
        isImportant: true,
      },
      {
        name: 'Projects',
        href: '/dashboard/projects',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
        badge: 'Primary',
        isImportant: true,
      },
    ]
  },
  {
    title: "Analytics",
    items: [
      {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        badge: null,
        isImportant: false,
      },
    ]
  },
  {
    title: "Account",
    items: [
      {
        name: 'Billing',
        href: '/dashboard/billing',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
        badge: null,
        isImportant: false,
      },
      {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        badge: null,
        isImportant: false,
      },
    ]
  },
];

const projectAnalyticsNavigation = [
  {
    title: "Live Analytics",
    items: [
      {
        name: 'Real-time',
        id: 'realtime',
        description: 'Live visitor activity and current performance',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        isImportant: true,
        badge: 'Live',
      },
    ]
  },
  {
    title: "Core Analytics",
    items: [
      {
        name: 'Analytics',
        id: 'analytics',
        description: 'Comprehensive analytics and performance metrics',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        isImportant: true,
        badge: null,
      },
      {
        name: 'Acquisition',
        id: 'acquisition',
        description: 'Traffic sources, organic search, and campaigns',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
        ),
        isImportant: true,
        badge: null,
      },
      {
        name: 'Behavior',
        id: 'behavior',
        description: 'User behavior, page flow, and content performance',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
        isImportant: false,
        badge: null,
      },
    ]
  },
  {
    title: "Advanced",
    items: [
      {
        name: 'Conversions',
        id: 'conversions',
        description: 'Goals, events, and conversion tracking',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
        isImportant: false,
        badge: 'New',
      },
    ]
  },
  {
    title: "Management",
    items: [
      {
        name: 'Users',
        id: 'users',
        description: 'Team access and collaboration settings',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        isImportant: false,
        badge: null,
      },
      {
        name: 'Setup',
        id: 'tracking',
        description: 'Install tracking code and configure settings',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
        isImportant: false,
        badge: null,
      },
    ]
  },
];

export function DashboardLayout({ children, session, projectContext }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isInProjectView, setIsInProjectView] = useState(false);

  useEffect(() => {
    setIsInProjectView(!!projectContext);
  }, [projectContext]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
          },
        },
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setIsSigningOut(false);
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const isActiveTab = (tabId: string) => {
    return projectContext?.activeTab === tabId;
  };

  const handleTabChange = (tabId: string) => {
    if (projectContext?.onTabChange) {
      projectContext.onTabChange(tabId);
      setIsMobileMenuOpen(false);
    }
  };

  const handleBackToProjects = () => {
    router.push('/dashboard/projects');
    setIsMobileMenuOpen(false);
  };

  const navigationData = isInProjectView ? projectAnalyticsNavigation : genericNavigation;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background border-r border-sidebar-border transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 focus-within:ring-2 focus-within:ring-primary/20
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border bg-sidebar-background/50">
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                {isInProjectView ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={handleBackToProjects}
                        className="p-1 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded transition-colors"
                        title="Back to Projects"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h2 className="text-sm font-semibold text-sidebar-foreground truncate">
                        {projectContext?.projectName}
                      </h2>
                    </div>
                    <p className="text-xs text-sidebar-foreground/70 ml-7">Analytics Dashboard</p>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push('/')}
                    className="text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                  >
                    ClickChutney
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg 
                className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {navigationData.map((section) => (
              <div key={section.title} className="space-y-1">
                {!isSidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-3 py-2">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isGenericItem = 'href' in item;
                    const isActive = isGenericItem ? isActiveRoute(item.href) : isActiveTab(item.id);
                    
                    return (
                      <button
                        key={isGenericItem ? item.name : item.id}
                        onClick={() => {
                          if (isGenericItem) {
                            router.push(item.href);
                            setIsMobileMenuOpen(false);
                          } else {
                            handleTabChange(item.id);
                          }
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative
                          ${isActive
                            ? 'bg-sidebar-primary/15 text-sidebar-primary border border-sidebar-primary/30 shadow-sm'
                            : item.isImportant
                              ? 'text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/80 border border-transparent hover:border-sidebar-border'
                              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                          }
                          ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-start'}
                          ${item.isImportant ? 'font-semibold' : ''}
                        `}
                        title={isSidebarCollapsed ? (isGenericItem ? item.name : `${item.name}: ${item.description}`) : undefined}
                      >
                        <div className={`flex-shrink-0 ${
                          isActive 
                            ? 'text-sidebar-primary' 
                            : item.isImportant 
                              ? 'text-sidebar-primary' 
                              : ''
                        }`}>
                          {item.icon}
                        </div>
                        {!isSidebarCollapsed && (
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{item.name}</p>
                              {!isGenericItem && (
                                <p className="text-xs text-sidebar-foreground/60 truncate leading-tight">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {item.badge && (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                item.badge === 'Live'
                                  ? 'bg-chart-4/20 text-chart-4 border border-chart-4/30 animate-pulse'
                                  : item.badge === 'New'
                                    ? 'bg-chart-1/20 text-chart-1 border border-chart-1/30'
                                    : item.badge === 'Primary'
                                      ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30'
                                      : 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                        {item.isImportant && !isActive && (
                          <div className="absolute right-2 w-1.5 h-1.5 bg-sidebar-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Quick Actions / Stats */}
          {!isSidebarCollapsed && (
            <div className="border-t border-sidebar-border p-4 bg-sidebar-background/30">
              {isInProjectView ? (
                <div>
                  <div className="text-xs text-sidebar-foreground/60 mb-2">Quick Stats</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center p-2 bg-chart-4/10 rounded-lg">
                      <div className="font-semibold text-chart-4">{Math.floor(Math.random() * 50) + 10}</div>
                      <div className="text-sidebar-foreground/60">Live</div>
                    </div>
                    <div className="text-center p-2 bg-sidebar-primary/10 rounded-lg">
                      <div className="font-semibold text-sidebar-primary">{Math.floor(Math.random() * 1000) + 500}</div>
                      <div className="text-sidebar-foreground/60">Today</div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/dashboard/projects')}
                  className="w-full bg-sidebar-primary/10 hover:bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/20 hover:border-sidebar-primary/30 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center group shadow-sm"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Project
                </button>
              )}
            </div>
          )}

          {/* User section */}
          <div className="border-t border-sidebar-border p-4 bg-sidebar-background/50">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary/20 to-chart-1/20 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-sidebar-primary/20 shadow-sm">
                  {session.user.image ? (
                    <Image 
                      src={session.user.image} 
                      alt="Profile" 
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-sidebar-primary">
                      {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chart-4 border-2 border-sidebar-background rounded-full"></div>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">
                    {session.user.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-chart-4 rounded-full animate-pulse"></div>
                    <span className="text-xs text-chart-4 font-medium">Online</span>
                  </div>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 rounded-md transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-sidebar-background border-b border-sidebar-border backdrop-blur-sm">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {isInProjectView ? (
              <>
                <h2 className="text-lg font-bold text-sidebar-foreground truncate">{projectContext?.projectName}</h2>
                <span className="text-xs bg-sidebar-primary/20 text-sidebar-primary px-2 py-1 rounded-full">
                  {projectContext?.activeTab ? projectContext.activeTab.charAt(0).toUpperCase() + projectContext.activeTab.slice(1) : 'Analytics'}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">ClickChutney</span>
            )}
          </div>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${
          isInProjectView && !isSidebarCollapsed ? 'lg:ml-0' : ''
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}