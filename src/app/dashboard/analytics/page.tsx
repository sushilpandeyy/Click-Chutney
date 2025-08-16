import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AnalyticsOverview } from './analytics-overview';

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardLayout session={session}>
      <AnalyticsOverview session={session} />
    </DashboardLayout>
  );
}