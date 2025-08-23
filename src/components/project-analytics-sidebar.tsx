'use client';

interface ProjectAnalyticsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  projectName: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const analyticsNavigation = [
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

export function ProjectAnalyticsSidebar({ 
  activeTab, 
  onTabChange, 
  projectName, 
  isCollapsed, 
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose 
}: ProjectAnalyticsSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-64 z-50 bg-background border-r border-border transform transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          w-72
        `}
        role="navigation"
        aria-label="Project analytics navigation"
      >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border bg-muted/30">
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">
                {projectName}
              </h2>
              <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
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
          {analyticsNavigation.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative
                      ${activeTab === item.id
                        ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm'
                        : item.isImportant
                          ? 'text-foreground hover:text-foreground hover:bg-accent/80 border border-transparent hover:border-border'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                      ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
                      ${item.isImportant ? 'font-semibold' : ''}
                    `}
                    title={isCollapsed ? `${item.name}: ${item.description}` : undefined}
                  >
                    <div className={`flex-shrink-0 ${
                      activeTab === item.id 
                        ? 'text-primary' 
                        : item.isImportant 
                          ? 'text-primary' 
                          : ''
                    }`}>
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground/80 truncate leading-tight">
                            {item.description}
                          </p>
                        </div>
                        {item.badge && (
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            item.badge === 'Live'
                              ? 'bg-chart-4/20 text-chart-4 border border-chart-4/30 animate-pulse'
                              : item.badge === 'New'
                                ? 'bg-chart-1/20 text-chart-1 border border-chart-1/30'
                                : 'bg-primary/20 text-primary border border-primary/30'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                    {item.isImportant && activeTab !== item.id && (
                      <div className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Quick Stats Footer */}
        {!isCollapsed && (
          <div className="border-t border-border p-4 bg-muted/20">
            <div className="text-xs text-muted-foreground mb-2">Quick Stats</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-2 bg-chart-4/10 rounded-lg">
                <div className="font-semibold text-chart-4">{Math.floor(Math.random() * 50) + 10}</div>
                <div className="text-muted-foreground">Live</div>
              </div>
              <div className="text-center p-2 bg-primary/10 rounded-lg">
                <div className="font-semibold text-primary">{Math.floor(Math.random() * 1000) + 500}</div>
                <div className="text-muted-foreground">Today</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}