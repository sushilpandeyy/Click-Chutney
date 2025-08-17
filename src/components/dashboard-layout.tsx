'use client';

import { signOut } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
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
}

const navigation = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
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
  },
];

export function DashboardLayout({ children, session }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-[#262626] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#262626]">
            <button
              onClick={() => router.push('/')}
              className={`text-xl font-bold text-white hover:text-gray-300 transition-colors ${
                isSidebarCollapsed ? 'hidden' : 'block'
              }`}
            >
              ClickChutney
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:block p-1.5 rounded-md hover:bg-[#1a1a1a] transition-colors"
            >
              <svg 
                className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActiveRoute(item.href)
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                  }
                  ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}
                `}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                {item.icon}
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-[#262626] p-4">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center flex-shrink-0">
                {session.user.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="Profile" 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-xs font-medium">
                    {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.user.email}
                  </p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isSigningOut ? 'Signing out...' : 'Sign out'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-[#111111] border-b border-[#262626]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-[#1a1a1a] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-semibold">ClickChutney</span>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}