import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProjectsOverview } from './projects-overview';

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardLayout session={session}>
      <ProjectsOverview session={session} />
    </DashboardLayout>
  );
}