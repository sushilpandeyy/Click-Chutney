import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProjectDashboard } from './project-dashboard';

export default async function ProjectDashboardPage({ 
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

  return (
    <ProjectDashboard session={session} projectId={resolvedParams.id} />
  );
}