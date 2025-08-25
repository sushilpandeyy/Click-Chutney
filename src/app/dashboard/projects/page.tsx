import { redirect } from 'next/navigation';

export default function ProjectsPage() {
  // Redirect to dashboard as projects are now merged with home
  redirect('/dashboard');
}