'use client';

import { useState, useEffect } from 'react';

interface UserSettings {
  // Profile
  name: string;
  email: string;
  timezone: string;
  dateFormat: string;
  
  // Notifications
  emailNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  alertsEnabled: boolean;
  marketingEmails: boolean;
  
  // Privacy & Security
  dataRetentionDays: number;
  allowDataExport: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number; // minutes
  
  // Analytics
  theme: 'light' | 'dark' | 'system';
  defaultTimeRange: string;
  autoRefresh: boolean;
  showRealTime: boolean;
  
  // API & Integrations
  apiKeyVisible: boolean;
  webhooksEnabled: boolean;
  corsOrigins: string[];
}

interface SettingsOverviewProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
      image?: string | null | undefined;
    };
  };
}

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney'
];

const DATE_FORMATS = [
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'DD MMM YYYY', value: 'DD MMM YYYY' }
];

const TIME_RANGES = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' }
];

const SESSION_TIMEOUTS = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '4 hours', value: 240 },
  { label: '8 hours', value: 480 },
  { label: '24 hours', value: 1440 }
];

export function SettingsOverview({ session }: SettingsOverviewProps) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [newCorsOrigin, setNewCorsOrigin] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Mock settings data for now
        // In production, this would fetch from your settings API
        const mockSettings: UserSettings = {
          // Profile
          name: session.user.name || '',
          email: session.user.email,
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          
          // Notifications
          emailNotifications: true,
          weeklyReports: true,
          monthlyReports: false,
          alertsEnabled: true,
          marketingEmails: false,
          
          // Privacy & Security
          dataRetentionDays: 90,
          allowDataExport: true,
          twoFactorEnabled: false,
          sessionTimeout: 120,
          
          // Analytics
          theme: 'dark',
          defaultTimeRange: '7d',
          autoRefresh: true,
          showRealTime: true,
          
          // API & Integrations
          apiKeyVisible: false,
          webhooksEnabled: false,
          corsOrigins: []
        };
        
        setSettings(mockSettings);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [session.user.name, session.user.email]);


  const saveSettings = async (updatedSettings: Partial<UserSettings>) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      const data = await response.json();
      setSettings(prev => ({ ...prev, ...data.settings }));
      setSuccessMessage('Settings saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (key: keyof UserSettings, value: string | number | boolean | string[]) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    
    // Auto-save after a short delay
    const timeoutId = setTimeout(() => {
      saveSettings({ [key]: value });
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const addCorsOrigin = () => {
    if (!newCorsOrigin.trim() || !settings) return;
    
    const updatedOrigins = [...settings.corsOrigins, newCorsOrigin.trim()];
    handleSettingChange('corsOrigins', updatedOrigins);
    setNewCorsOrigin('');
  };

  const removeCorsOrigin = (index: number) => {
    if (!settings) return;
    
    const updatedOrigins = settings.corsOrigins.filter((_, i) => i !== index);
    handleSettingChange('corsOrigins', updatedOrigins);
  };

  const generateApiKey = () => {
    // Generate a mock API key
    const apiKey = `cc_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    console.log('Generated API key:', apiKey);
    setSuccessMessage('New API key generated');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy & Security', icon: '🔒' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'api', name: 'API & Integrations', icon: '🔌' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
          <span className="text-gray-400">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account preferences, notifications, and integrations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings?.name || ''}
                      onChange={(e) => handleSettingChange('name', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings?.email || ''}
                      disabled
                      className="w-full bg-[#0a0a0a] border border-[#262626] text-gray-400 rounded-md px-3 py-2 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings?.timezone || 'UTC'}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings?.dateFormat || 'MM/DD/YYYY'}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {DATE_FORMATS.map((format) => (
                        <option key={format.value} value={format.value}>{format.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <p className="text-gray-400 text-sm">Receive important updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.emailNotifications || false}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Weekly Reports</h3>
                      <p className="text-gray-400 text-sm">Get weekly analytics summaries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.weeklyReports || false}
                        onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Monthly Reports</h3>
                      <p className="text-gray-400 text-sm">Receive monthly analytics insights</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.monthlyReports || false}
                        onChange={(e) => handleSettingChange('monthlyReports', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Alert Notifications</h3>
                      <p className="text-gray-400 text-sm">Get notified about unusual activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.alertsEnabled || false}
                        onChange={(e) => handleSettingChange('alertsEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Marketing Emails</h3>
                      <p className="text-gray-400 text-sm">Receive product updates and tips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.marketingEmails || false}
                        onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Data Retention Period
                    </label>
                    <select
                      value={settings?.dataRetentionDays || 365}
                      onChange={(e) => handleSettingChange('dataRetentionDays', parseInt(e.target.value))}
                      className="w-full md:w-auto bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={180}>6 months</option>
                      <option value={365}>1 year</option>
                      <option value={730}>2 years</option>
                    </select>
                    <p className="text-gray-400 text-xs mt-1">How long to keep analytics data</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Session Timeout
                    </label>
                    <select
                      value={settings?.sessionTimeout || 120}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full md:w-auto bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {SESSION_TIMEOUTS.map((timeout) => (
                        <option key={timeout.value} value={timeout.value}>{timeout.label}</option>
                      ))}
                    </select>
                    <p className="text-gray-400 text-xs mt-1">Automatically log out after inactivity</p>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-[#262626]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Allow Data Export</h3>
                        <p className="text-gray-400 text-sm">Enable downloading of your analytics data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.allowDataExport || false}
                          onChange={(e) => handleSettingChange('allowDataExport', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                        <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        onClick={() => console.log('Setup 2FA')}
                      >
                        {settings?.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Analytics Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Default Time Range
                    </label>
                    <select
                      value={settings?.defaultTimeRange || '7d'}
                      onChange={(e) => handleSettingChange('defaultTimeRange', e.target.value)}
                      className="w-full md:w-auto bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {TIME_RANGES.map((range) => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Auto Refresh</h3>
                        <p className="text-gray-400 text-sm">Automatically refresh analytics data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.autoRefresh || false}
                          onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Show Real-time Data</h3>
                        <p className="text-gray-400 text-sm">Display live visitor activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.showRealTime || false}
                          onChange={(e) => handleSettingChange('showRealTime', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">API & Integrations</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">API Key</h3>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={showApiKey ? 'cc_example_api_key_12345678901234567890' : '••••••••••••••••••••••••••••••••'}
                          readOnly
                          className="w-full bg-[#0a0a0a] border border-[#262626] text-gray-400 rounded-md px-3 py-2 text-sm font-mono"
                        />
                      </div>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="bg-[#262626] hover:bg-[#404040] text-white rounded-md px-3 py-2 text-sm transition-colors"
                      >
                        {showApiKey ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={generateApiKey}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm transition-colors"
                      >
                        Regenerate
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Use this key to access the ClickChutney API</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-3">CORS Origins</h3>
                    <div className="space-y-3">
                      {settings?.corsOrigins.map((origin, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#262626] rounded-md">
                          <code className="flex-1 text-sm text-blue-400 font-mono">{origin}</code>
                          <button
                            onClick={() => removeCorsOrigin(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={newCorsOrigin}
                          onChange={(e) => setNewCorsOrigin(e.target.value)}
                          placeholder="https://example.com"
                          className="flex-1 bg-[#0a0a0a] border border-[#262626] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          onClick={addCorsOrigin}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Domains allowed to make API requests from browsers</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
                    <div>
                      <h3 className="text-white font-medium">Webhooks</h3>
                      <p className="text-gray-400 text-sm">Receive real-time notifications</p>
                    </div>
                    <button 
                      className="bg-[#262626] hover:bg-[#404040] text-white rounded-md px-4 py-2 text-sm transition-colors"
                      onClick={() => console.log('Configure webhooks')}
                    >
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-[#262626] flex justify-end">
              <button
                onClick={() => settings && saveSettings(settings)}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md px-6 py-2 text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isSaving && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}