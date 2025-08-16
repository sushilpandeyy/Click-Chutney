import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AnalyticsClient } from './analytics-client';

export default async function ProjectAnalyticsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/login');
  }

  const resolvedParams = await params;

  return <AnalyticsClient session={session} projectId={resolvedParams.id} />;
}