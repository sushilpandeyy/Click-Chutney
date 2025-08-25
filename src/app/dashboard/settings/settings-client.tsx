'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  statistics: {
    totalProjects: number;
    activeProjects: number;
    totalEvents: number;
    memberSince: string;
  };
  connectedAccounts: Array<{
    providerId: string;
    providerAccountId: string;
    createdAt: string;
  }>;
}

interface UserSettings {
  emailNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  dataRetentionDays: number;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
}

interface SettingsClientProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
    };
  };
}

export function SettingsClient({ session }: SettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [profileResponse, settingsResponse] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/settings')
      ]);

      if (!profileResponse.ok || !settingsResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const profileData = await profileResponse.json();
      const settingsData = await settingsResponse.json();

      setProfile(profileData);
      setSettings(settingsData.settings);
      setProfileForm({
        name: profileData.name || '',
        email: profileData.email || ''
      });
    } catch (err) {
      console.error('Settings fetch error:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setProfile(prev => prev ? { ...prev, ...updatedUser } : null);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsUpdate = async (updatedSettings: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...settings, ...updatedSettings }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      setSuccess('Settings updated successfully');
    } catch {
      setError('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
          <span className="text-gray-400">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
                <button 
                  onClick={() => router.push('/dashboard/projects')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Projects
                </button>
                <button 
                  onClick={() => router.push('/dashboard/projects')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Analytics
                </button>
                <button className="text-white border-b-2 border-blue-500 pb-1 text-sm font-medium">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and configurations.</p>
        </div>

        {(error || success) && (
          <div className={`mb-6 p-4 rounded-md ${
            error 
              ? 'bg-red-900/20 border border-red-800/30' 
              : 'bg-green-900/20 border border-green-800/30'
          }`}>
            <p className={error ? 'text-red-400' : 'text-green-400'}>
              {error || success}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="bg-[#111111] border border-[#262626] rounded-lg p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[#0a0a0a] text-white border border-[#262626]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preferences'
                    ? 'bg-[#0a0a0a] text-white border border-[#262626]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'security'
                    ? 'bg-[#0a0a0a] text-white border border-[#262626]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && profile && (
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#262626] pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Account Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-[#0a0a0a] border border-[#262626] rounded-md p-4">
                        <p className="text-sm text-gray-400">Projects</p>
                        <p className="text-xl font-bold text-white">{profile.statistics.totalProjects}</p>
                      </div>
                      <div className="bg-[#0a0a0a] border border-[#262626] rounded-md p-4">
                        <p className="text-sm text-gray-400">Active</p>
                        <p className="text-xl font-bold text-white">{profile.statistics.activeProjects}</p>
                      </div>
                      <div className="bg-[#0a0a0a] border border-[#262626] rounded-md p-4">
                        <p className="text-sm text-gray-400">Total Events</p>
                        <p className="text-xl font-bold text-white">{profile.statistics.totalEvents.toLocaleString()}</p>
                      </div>
                      <div className="bg-[#0a0a0a] border border-[#262626] rounded-md p-4">
                        <p className="text-sm text-gray-400">Member Since</p>
                        <p className="text-sm font-medium text-white">
                          {new Date(profile.statistics.memberSince).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && settings && (
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Email notifications</span>
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingsUpdate({ emailNotifications: e.target.checked })}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Weekly reports</span>
                        <input
                          type="checkbox"
                          checked={settings.weeklyReports}
                          onChange={(e) => handleSettingsUpdate({ weeklyReports: e.target.checked })}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Monthly reports</span>
                        <input
                          type="checkbox"
                          checked={settings.monthlyReports}
                          onChange={(e) => handleSettingsUpdate({ monthlyReports: e.target.checked })}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-[#262626] pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Data & Privacy</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="retention" className="block text-sm font-medium text-white mb-2">
                          Data Retention (days)
                        </label>
                        <select
                          id="retention"
                          value={settings.dataRetentionDays}
                          onChange={(e) => handleSettingsUpdate({ dataRetentionDays: parseInt(e.target.value) })}
                          className="bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value={30}>30 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>180 days</option>
                          <option value={365}>1 year</option>
                          <option value={730}>2 years</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-white mb-2">
                          Timezone
                        </label>
                        <select
                          id="timezone"
                          value={settings.timezone}
                          onChange={(e) => handleSettingsUpdate({ timezone: e.target.value })}
                          className="bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Paris">Paris</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && profile && (
              <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Security</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Connected Accounts</h3>
                    {profile.connectedAccounts.length > 0 ? (
                      <div className="space-y-3">
                        {profile.connectedAccounts.map((account, index) => (
                          <div key={index} className="flex items-center justify-between bg-[#0a0a0a] border border-[#262626] rounded-md p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                              </div>
                              <div>
                                <p className="text-white font-medium capitalize">{account.providerId}</p>
                                <p className="text-gray-400 text-sm">Connected {new Date(account.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">
                              Connected
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No connected accounts</p>
                    )}
                  </div>

                  <div className="border-t border-[#262626] pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Account Actions</h3>
                    <div className="space-y-4">
                      <button className="bg-red-600/20 border border-red-600/30 text-red-400 rounded-md px-4 py-2 text-sm font-medium hover:bg-red-600/30 transition-colors">
                        Delete Account
                      </button>
                      <p className="text-gray-400 text-sm">
                        This action cannot be undone. All your projects and analytics data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}