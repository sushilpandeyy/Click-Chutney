'use client';

import { useState, useEffect } from 'react';

interface UsageStats {
  currentPeriod: {
    events: number;
    projects: number;
    storage: number; // in MB
    apiCalls: number;
  };
  limits: {
    events: number;
    projects: number;
    storage: number; // in MB
    apiCalls: number;
  };
  periodStart: string;
  periodEnd: string;
}

interface BillingData {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  currentPlan: {
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
  };
  usage: UsageStats;
  invoices: Array<{
    id: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    date: string;
    downloadUrl?: string;
  }>;
  paymentMethod?: {
    type: 'card';
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

interface BillingOverviewProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string | null | undefined;
    };
  };
}

const PLANS = [
  {
    name: 'Free',
    price: 0,
    interval: 'month' as const,
    features: [
      '1 Project',
      '1K Events/month',
      '10MB Storage',
      '100 API Calls/day',
      'Basic Analytics',
      'Email Support'
    ],
    limits: {
      events: 1000,
      projects: 1,
      storage: 10,
      apiCalls: 100
    }
  },
  {
    name: 'Pro',
    price: 29,
    interval: 'month' as const,
    features: [
      '10 Projects',
      '50K Events/month',
      '1GB Storage',
      '10K API Calls/day',
      'Advanced Analytics',
      'Custom Events',
      'Real-time Data',
      'Priority Support'
    ],
    limits: {
      events: 50000,
      projects: 10,
      storage: 1024,
      apiCalls: 10000
    }
  },
  {
    name: 'Business',
    price: 99,
    interval: 'month' as const,
    features: [
      'Unlimited Projects',
      '500K Events/month',
      '10GB Storage',
      '100K API Calls/day',
      'Advanced Analytics',
      'Custom Dashboards',
      'Data Export',
      'Team Collaboration',
      '24/7 Support',
      'SLA Guarantee'
    ],
    limits: {
      events: 500000,
      projects: -1, // unlimited
      storage: 10240,
      apiCalls: 100000
    }
  }
];

export function BillingOverview({ session }: BillingOverviewProps) {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock billing data for now
      // In production, this would fetch from your billing API
      const freePlan = PLANS[0];
      if (!freePlan) {
        throw new Error('No plans available');
      }
      
      const mockData: BillingData = {
        user: {
          id: session.user.id,
          name: session.user.name || null,
          email: session.user.email
        },
        currentPlan: freePlan, // Free plan
        usage: {
          currentPeriod: {
            events: 450,
            projects: 1,
            storage: 2.5,
            apiCalls: 45
          },
          limits: freePlan.limits,
          periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
          periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
        },
        invoices: [
          {
            id: 'inv_001',
            amount: 0,
            status: 'paid',
            date: new Date().toISOString()
          }
        ]
      };

      setBillingData(mockData);
    } catch (err) {
      console.error('Error fetching billing data:', err);
      setError('Failed to load billing data');
    } finally {
      setIsLoading(false);
    }
  };

    fetchBillingData();
  }, [session.user.id, session.user.name, session.user.email]);

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-400 bg-red-600/20';
    if (percentage >= 70) return 'text-yellow-400 bg-yellow-600/20';
    return 'text-green-400 bg-green-600/20';
  };

  const handlePlanChange = (planName: string) => {
    // In production, this would trigger your payment flow
    console.log('Plan change requested:', planName);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
          <span className="text-gray-400">Loading billing information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Usage</h1>
        <p className="text-gray-400">
          Manage your subscription, view usage statistics, and billing history.
        </p>
      </div>

      <div className="mb-8 bg-[#111111] border border-[#262626] rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Current Plan</h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-400">{billingData?.currentPlan.name}</span>
              <span className="text-gray-400">
                ${billingData?.currentPlan.price}/{billingData?.currentPlan.interval}
              </span>
              {billingData?.currentPlan.name === 'Free' && (
                <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">
                  Current
                </span>
              )}
            </div>
            <p className="text-gray-400 mt-2">
              Billing period: {new Date(billingData?.usage.periodStart || '').toLocaleDateString()} - {new Date(billingData?.usage.periodEnd || '').toLocaleDateString()}
            </p>
          </div>
          {billingData?.currentPlan.name !== 'Business' && (
            <button 
              onClick={() => handlePlanChange('Pro')}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 text-sm font-medium transition-colors"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Current Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Events</h3>
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{billingData?.usage.currentPeriod.events.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">
                  / {billingData?.usage.limits.events.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-full bg-[#262626] rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(billingData?.usage.currentPeriod.events || 0, billingData?.usage.limits.events || 1))}`}
                style={{ width: `${getUsagePercentage(billingData?.usage.currentPeriod.events || 0, billingData?.usage.limits.events || 1)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {getUsagePercentage(billingData?.usage.currentPeriod.events || 0, billingData?.usage.limits.events || 1).toFixed(1)}% used
            </p>
          </div>

          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Projects</h3>
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{billingData?.usage.currentPeriod.projects}</span>
                <span className="text-gray-400 text-sm">
                  / {billingData?.usage.limits.projects === -1 ? '∞' : billingData?.usage.limits.projects}
                </span>
              </div>
            </div>
            {billingData?.usage.limits.projects !== -1 && (
              <>
                <div className="w-full bg-[#262626] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(billingData?.usage.currentPeriod.projects || 0, billingData?.usage.limits.projects || 1))}`}
                    style={{ width: `${getUsagePercentage(billingData?.usage.currentPeriod.projects || 0, billingData?.usage.limits.projects || 1)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {getUsagePercentage(billingData?.usage.currentPeriod.projects || 0, billingData?.usage.limits.projects || 1).toFixed(1)}% used
                </p>
              </>
            )}
            {billingData?.usage.limits.projects === -1 && (
              <p className="text-xs text-emerald-500 mt-2">Unlimited</p>
            )}
          </div>

          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Storage</h3>
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{billingData?.usage.currentPeriod.storage.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">
                  / {billingData?.usage.limits.storage} MB
                </span>
              </div>
            </div>
            <div className="w-full bg-[#262626] rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(billingData?.usage.currentPeriod.storage || 0, billingData?.usage.limits.storage || 1))}`}
                style={{ width: `${getUsagePercentage(billingData?.usage.currentPeriod.storage || 0, billingData?.usage.limits.storage || 1)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {getUsagePercentage(billingData?.usage.currentPeriod.storage || 0, billingData?.usage.limits.storage || 1).toFixed(1)}% used
            </p>
          </div>

          <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">API Calls (Today)</h3>
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h3.5a3.5 3.5 0 100-7H11V3.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 3.414V6H5.5A3.5 3.5 0 002 9.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{billingData?.usage.currentPeriod.apiCalls.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">
                  / {billingData?.usage.limits.apiCalls.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-full bg-[#262626] rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(billingData?.usage.currentPeriod.apiCalls || 0, billingData?.usage.limits.apiCalls || 1))}`}
                style={{ width: `${getUsagePercentage(billingData?.usage.currentPeriod.apiCalls || 0, billingData?.usage.limits.apiCalls || 1)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {getUsagePercentage(billingData?.usage.currentPeriod.apiCalls || 0, billingData?.usage.limits.apiCalls || 1).toFixed(1)}% used
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`bg-[#111111] border rounded-lg p-6 relative ${
              billingData?.currentPlan.name === plan.name 
                ? 'border-blue-500 ring-1 ring-blue-500' 
                : 'border-[#262626]'
            }`}>
              {billingData?.currentPlan.name === plan.name && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanChange(plan.name)}
                disabled={billingData?.currentPlan.name === plan.name}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  billingData?.currentPlan.name === plan.name
                    ? 'bg-[#262626] text-gray-400 cursor-not-allowed'
                    : plan.name === 'Pro'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-[#0a0a0a] border border-[#262626] text-white hover:bg-[#1a1a1a] hover:border-[#404040]'
                }`}
              >
                {billingData?.currentPlan.name === plan.name ? 'Current Plan' : 
                 plan.price === 0 ? 'Downgrade' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
          
          {billingData?.paymentMethod ? (
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#262626] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#262626] rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm">
                    {billingData.paymentMethod.brand.toUpperCase()} •••• {billingData.paymentMethod.last4}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                Update
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-gray-400 text-sm mb-4">No payment method on file</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors">
                Add Payment Method
              </button>
            </div>
          )}
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Billing History</h2>
          
          <div className="space-y-3">
            {billingData?.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#262626] rounded-lg">
                <div>
                  <p className="text-white text-sm">
                    ${invoice.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(invoice.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-600/20 text-green-400' :
                    invoice.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                  {invoice.downloadUrl && (
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}