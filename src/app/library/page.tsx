import { auth } from '@/auth';
import ClientDashboard from '@/components/ClientDashboard';
import { redirect } from 'next/navigation';

export default async function LibraryPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <ClientDashboard userName={session.user?.name || session.user?.email || 'Reader'} />;
}
